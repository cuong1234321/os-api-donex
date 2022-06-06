import WithdrawalRequestEntity from '@entities/withdrawalRequests';
import WithdrawalRequestInterface from '@interfaces/withdrawalRequests';
import dayjs from 'dayjs';
import _ from 'lodash';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import CollaboratorModel from './collaborators';
import MBankModel from './mBanks';
import SellerBankModel from './sellerBanks';

class WithdrawalRequestModel extends Model<WithdrawalRequestInterface> implements WithdrawalRequestInterface {
  public id: number;
  public code: string;
  public ownerId: number;
  public ownerBankId: number;
  public amount: number;
  public status: string;
  public approvalNote: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly CREATABLE_PARAMETERS = ['ownerBankId', 'amount']

  static readonly STATUS_ENUM = { PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected' }
  static readonly MINIMUM_WITHDRAWAL_AMOUNT = 50000
  static readonly MINIMUM_WALLET_AMOUNT = 200000

  static readonly hooks: Partial<ModelHooks<WithdrawalRequestModel>> = {
    async beforeValidate (record) {
      await record.assignCode();
    },
  }

  static readonly validations: ModelValidateOptions = {
    async validOwnerBank () {
      const userBank = await SellerBankModel.scope([
        { method: ['bySeller', this.ownerId] },
        { method: ['byId', this.ownerBankId] },
      ]).findOne();
      if (!userBank) {
        throw new ValidationErrorItem('Thông tin ngân hàng không hợp lệ.', 'validOwnerBank', 'ownerBankId', this.ownerBankId);
      }
    },
    validAmount () {
      if (this.amount < WithdrawalRequestModel.MINIMUM_WITHDRAWAL_AMOUNT) {
        throw new ValidationErrorItem(`Số tiền yêu cầu rút không hợp lệ (tối thiêu ${WithdrawalRequestModel.MINIMUM_WITHDRAWAL_AMOUNT.toLocaleString('de-DE')}đ)`, 'validAmount', 'amount', this.amount);
      }
    },
    async validWalletAmount () {
      const user = await CollaboratorModel.findByPk(this.ownerId);
      if (user.accumulatedMoney - this.amount < WithdrawalRequestModel.MINIMUM_WALLET_AMOUNT && this.status !== WithdrawalRequestModel.STATUS_ENUM.REJECTED) {
        throw new ValidationErrorItem(
          `Số tiền còn lại trong ví không đủ. Yêu cầu còn lại tối thiểu ${WithdrawalRequestModel.MINIMUM_WALLET_AMOUNT.toLocaleString('de-DE')}đ để duy trì ví`,
          'validAmount',
          'amount',
          this.amount,
        );
      }
    },
  }

  private async assignCode () {
    if (this.code) return;
    this.setDataValue('code', await this.generateCode());
  }

  private async generateCode () {
    let code = `${_.padStart(this.ownerId.toString(), 4, '0')}`;
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 4; i > 0; --i) code += characters[Math.floor(Math.random() * characters.length)];
    const existedRequest = await WithdrawalRequestModel.scope([{ method: ['byCode', code] }]).findOne();
    if (existedRequest) code = await this.generateCode();
    return code;
  }

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return {
        where: { id },
      };
    },
    byFreeWord (freeWord) {
      return {
        where: { title: { [Op.like]: `%${freeWord || ''}%` } },
      };
    },
    withOwner () {
      return {
        include: [
          {
            model: CollaboratorModel,
            as: 'owner',
            attributes: ['type', 'fullName', 'phoneNumber', 'id', 'email', 'avatar'],
          },
        ],
      };
    },
    withBank () {
      return {
        include: [
          {
            model: SellerBankModel,
            as: 'sellerBank',
            include: [
              {
                model: MBankModel,
                as: 'bank',
              },
            ],
          },
        ],
      };
    },
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    byOwner (ownerId) {
      return {
        where: { ownerId },
      };
    },
    byCreatedAt (from, to) {
      if (!from && !to) return { where: {} };
      const createdAtCondition: any = {};
      if (from) Object.assign(createdAtCondition, { [Op.gt]: dayjs(from as string).startOf('day').format() });
      if (to) Object.assign(createdAtCondition, { [Op.lte]: dayjs(to as string).endOf('day').format() });
      return {
        where: { createdAt: createdAtCondition },
      };
    },
    byStatus (status) {
      return {
        where: { status },
      };
    },
    byBank (bankId) {
      return {
        include: [
          { model: SellerBankModel, as: 'sellerBank', where: { bankId }, required: true },
        ],
      };
    },
    byWithdrawalFreeWord (freeWord) {
      return {
        include: [
          {
            model: CollaboratorModel,
            as: 'owner',
            where: {
              [Op.or]: [
                { phoneNumber: { [Op.like]: `%${freeWord || ''}%` } },
                { fullName: { [Op.like]: `%${freeWord || ''}%` } },
              ],
            },
            required: true,
          },
        ],
      };
    },
    byCode (code) {
      return { where: { code } };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(WithdrawalRequestEntity, {
      hooks: WithdrawalRequestModel.hooks,
      scopes: WithdrawalRequestModel.scopes,
      validate: WithdrawalRequestModel.validations,
      tableName: 'withdrawal_requests',
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(CollaboratorModel, { as: 'owner', foreignKey: 'ownerId' });
    this.belongsTo(SellerBankModel, { as: 'sellerBank', foreignKey: 'ownerBankId' });
  }
}

export default WithdrawalRequestModel;
