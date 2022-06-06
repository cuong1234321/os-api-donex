import MoneyWalletChangeEntity from '@entities/moneyWalletChanges';
import MoneyWalletChangeInterface from '@interfaces/moneyWalletChanges';
import dayjs from 'dayjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import CollaboratorModel from './collaborators';
import OrderModel from './orders';
import SubOrderModel from './subOrders';
import TopUpDepositModel from './topUpDeposits';
import WithdrawalRequestModel from './withdrawalRequests';

class MoneyWalletChangeModel extends Model<MoneyWalletChangeInterface> implements MoneyWalletChangeInterface {
  public id: number;
  public ownerId: number;
  public type: string;
  public mutableType: string;
  public mutableId: number;
  public amount: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly TYPE_ENUM = { SUBTRACT: 'subtract', ADD: 'add' }
  static readonly MUTABLE_TYPE = {
    WITHDRAWAL_REQUEST: 'withdrawalRequest',
    TOP_UP_DEPOSIT: 'topUpDeposit',
    COMMISSION: 'commission',
    REFERRAL: 'referral',
    AFFILIATE_COMMISSION: 'affiliateCommission',
    ORDER: 'order',
  }

  static readonly hooks: Partial<ModelHooks<MoneyWalletChangeModel>> = {
    async afterCreate (record) {
      await record.updateAccumulatedMoney();
    },
    async afterFind (result: MoneyWalletChangeModel | MoneyWalletChangeModel[]) {
      if (!result) return;
      if (!Array.isArray(result)) result = [result as MoneyWalletChangeModel];
      for (const instance of result) {
        instance.assignMutableObject();
      }
    },
  }

  static readonly validations: ModelValidateOptions = { }

  private async updateAccumulatedMoney () {
    const seller = await CollaboratorModel.findByPk(this.ownerId);
    await seller.update({ accumulatedMoney: seller.accumulatedMoney + this.amount });
  }

  private assignMutableObject () {
    switch (this.mutableType) {
      case MoneyWalletChangeModel.MUTABLE_TYPE.WITHDRAWAL_REQUEST:
        if ((this as any).withdrawalRequest) { (this as any).setDataValue('mutableObject', (this as any).withdrawalRequest); }
        break;
      case MoneyWalletChangeModel.MUTABLE_TYPE.TOP_UP_DEPOSIT:
        if ((this as any).topUpDeposit) { (this as any).setDataValue('mutableObject', (this as any).topUpDeposit); }
        break;
      case MoneyWalletChangeModel.MUTABLE_TYPE.ORDER:
        if ((this as any).order) { (this as any).setDataValue('mutableObject', (this as any).order); }
        break;
      case MoneyWalletChangeModel.MUTABLE_TYPE.COMMISSION:
        if ((this as any).subOrder) { (this as any).setDataValue('mutableObject', (this as any).subOrder); }
        break;
      case MoneyWalletChangeModel.MUTABLE_TYPE.REFERRAL:
        if ((this as any).seller) { (this as any).setDataValue('mutableObject', (this as any).seller); }
        break;
      default:
        break;
    }
    delete (this as any).withdrawalRequest;
    delete (this as any).topUpDeposit;
    delete (this as any).order;
    delete (this as any).subOrder;
    delete (this as any).seller;
    delete (this as any).dataValues.withdrawalRequest;
    delete (this as any).dataValues.topUpDeposit;
    delete (this as any).dataValues.order;
    delete (this as any).dataValues.subOrder;
    delete (this as any).dataValues.seller;
  }

  static readonly scopes: ModelScopeOptions = {
    byType (type) {
      return { where: { type } };
    },
    byMutableType (mutableType) {
      return { where: { mutableType } };
    },
    byOwner (ownerId) {
      return { where: { ownerId } };
    },
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
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
    withMutableObject () {
      return {
        include: [
          { model: WithdrawalRequestModel, as: 'withdrawalRequest' },
          { model: TopUpDepositModel, as: 'topUpDeposit' },
          { model: OrderModel, as: 'order' },
          { model: SubOrderModel, as: 'subOrder' },
          { model: CollaboratorModel, as: 'seller' },
        ],
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(MoneyWalletChangeEntity, {
      hooks: MoneyWalletChangeModel.hooks,
      scopes: MoneyWalletChangeModel.scopes,
      validate: MoneyWalletChangeModel.validations,
      tableName: 'money_wallet_changes',
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(WithdrawalRequestModel, { as: 'withdrawalRequest', foreignKey: 'mutableId' });
    this.belongsTo(TopUpDepositModel, { as: 'topUpDeposit', foreignKey: 'mutableId' });
    this.belongsTo(OrderModel, { as: 'order', foreignKey: 'mutableId' });
    this.belongsTo(SubOrderModel, { as: 'subOrder', foreignKey: 'mutableId' });
    this.belongsTo(CollaboratorModel, { as: 'seller', foreignKey: 'mutableId' });
  }
}

export default MoneyWalletChangeModel;
