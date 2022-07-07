import TopUpDepositEntity from '@entities/topUpDeposits';
import TopUpDepositInterface from '@interfaces/topUpDeposits';
import VnpayPaymentService from '@services/vnpayPayment';
import dayjs from 'dayjs';
import _ from 'lodash';
import { HasOneSetAssociationMixin, Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import CollaboratorModel from './collaborators';
import MoneyWalletChangeModel from './moneyWalletChanges';

class TopUpDepositModel extends Model<TopUpDepositInterface> implements TopUpDepositInterface {
  public id: number;
  public code: string;
  public creatableType: string;
  public ownerId: number;
  public type: string;
  public transactionId: string;
  public status: string;
  public amount: number;
  public note: string;
  public portalConfirmAt: Date;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly TYPE_ENUM = { VN_PAY: 'vnPay', BANKING: 'banking' }
  static readonly CREATABLE_TYPE_ENUM = { ADMIN: 'admin', SELLER: 'seller' }
  static readonly STATUS_ENUM = {
    PENDING: 'pending',
    COMPLETE: 'complete',
    FAIL: 'fail',
  };

  static readonly ADMIN_CREATABLE_PARAMETERS = ['ownerId', 'type', 'status', 'amount', 'note']
  static readonly ADMIN_UPDATABLE_PARAMETERS = ['ownerId', 'type', 'status', 'amount', 'note']

  static readonly hooks: Partial<ModelHooks<TopUpDepositModel>> = {
    async beforeValidate (record) {
      await record.assignCode();
    },
    async afterSave (record) {
      if (((record as any)._previousDataValues.status === TopUpDepositModel.STATUS_ENUM.PENDING &&
        record.status === TopUpDepositModel.STATUS_ENUM.COMPLETE) ||
        (record.creatableType === TopUpDepositModel.CREATABLE_TYPE_ENUM.ADMIN && record.status === TopUpDepositModel.STATUS_ENUM.COMPLETE)
      ) {
        await MoneyWalletChangeModel.create({
          id: undefined,
          ownerId: record.ownerId,
          type: MoneyWalletChangeModel.TYPE_ENUM.ADD,
          mutableType: MoneyWalletChangeModel.MUTABLE_TYPE.TOP_UP_DEPOSIT,
          mutableId: record.id,
          amount: record.amount,
        });
      }
    },
  }

  public async getPaymentMethod () {
    const paymentMethodInstance = new VnpayPaymentService(this.id, this.transactionId, this.amount, VnpayPaymentService.TXN_REF_PREFIX.TOP_UP, true);
    const paymentId = paymentMethodInstance.txnRef;
    const result = await paymentMethodInstance.makePayment();
    await this.update({ transactionId: paymentId as string });
    return result;
  }

  public async isPaid (responseParams?: any) {
    const params = JSON.parse(JSON.stringify(responseParams));
    const result = params.vnp_TransactionStatus === '00' &&
          (await (new VnpayPaymentService(this.id, this.transactionId, this.amount, VnpayPaymentService.TXN_REF_PREFIX.TOP_UP)).validSignature(params));
    return result;
  }

  public async validSignature (responseParams?: any) {
    let result: boolean = false;
    const params = JSON.parse(JSON.stringify(responseParams));
    result = await (new VnpayPaymentService(this.id, this.transactionId, this.amount, VnpayPaymentService.TXN_REF_PREFIX.TOP_UP)).validSignature(params);
    return result;
  }

  private async assignCode () {
    if (this.code) return;
    this.setDataValue('code', await this.generateCode());
  }

  private async generateCode () {
    let code = `${_.padStart(this.ownerId.toString(), 4, '0')}`;
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 4; i > 0; --i) code += characters[Math.floor(Math.random() * characters.length)];
    const existedRequest = await TopUpDepositModel.scope([{ method: ['byCode', code] }]).findOne();
    if (existedRequest) code = await this.generateCode();
    return code;
  }

  static readonly validations: ModelValidateOptions = { }

  public setMoneyWalletChange: HasOneSetAssociationMixin<MoneyWalletChangeModel, number>

  static readonly scopes: ModelScopeOptions = {
    byPayment (transactionId) {
      return {
        where: { transactionId },
      };
    },
    byStatus (status) {
      return {
        where: { status },
      };
    },
    byId (id) {
      return {
        where: { id },
      };
    },
    byCode (code) {
      return { where: { code } };
    },
    bySeller (ownerId) {
      return {
        where: { ownerId },
      };
    },
    byType (type) {
      return { where: { type } };
    },
    byCreatableType (creatableType) {
      return { where: { creatableType } };
    },
    byDepositorFreeWord (freeWord) {
      return {
        where: {
          [Op.or]: [
            { code: freeWord },
            { ownerId: { [Op.in]: Sequelize.literal(`(SELECT id FROM collaborators WHERE phoneNumber LIKE "%${freeWord}%" OR fullName LIKE "%${freeWord}%")`) } },
          ],
        },
      };
    },
    withSeller () {
      return {
        include: [
          {
            model: CollaboratorModel,
            as: 'seller',
            attributes: ['phoneNumber', 'fullName', 'email', 'avatar'],
          },
        ],
      };
    },
    bySortOrder (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    byDate (from, to) {
      if (!from && !to) return { where: {} };
      const createdAtCondition: any = {};
      if (from) Object.assign(createdAtCondition, { [Op.gt]: dayjs(from as string).startOf('day').format() });
      if (to) Object.assign(createdAtCondition, { [Op.lte]: dayjs(to as string).endOf('day').format() });
      return {
        where: { createdAt: createdAtCondition },
      };
    },
    isNotFail () {
      return {
        where: { status: { [Op.ne]: TopUpDepositModel.STATUS_ENUM.FAIL } },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(TopUpDepositEntity, {
      hooks: TopUpDepositModel.hooks,
      scopes: TopUpDepositModel.scopes,
      validate: TopUpDepositModel.validations,
      tableName: 'top_up_deposits',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.hasOne(MoneyWalletChangeModel, { as: 'moneyWalletChange', foreignKey: 'mutableId' });
    this.belongsTo(CollaboratorModel, { as: 'seller', foreignKey: 'ownerId' });
  }
}

export default TopUpDepositModel;
