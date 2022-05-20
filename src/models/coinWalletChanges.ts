import CoinWalletChangeEntity from '@entities/coinWalletChanges';
import CoinWalletChangeInterface from '@interfaces/coinWalletChanges';
import dayjs from 'dayjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import UserModel from './users';

class CoinWalletChangeModel extends Model<CoinWalletChangeInterface> implements CoinWalletChangeInterface {
  public id: number;
  public userId: number;
  public type: string;
  public mutableType: string;
  public mutableId: number;
  public amount: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly TYPE_ENUM = { SUBTRACT: 'subtract', ADD: 'add' }
  static readonly MUTABLE_TYPE = { USER_VOUCHER: 'userVoucher', ORDER: 'order', ORDER_REWARD: 'orderReward' }

  static readonly hooks: Partial<ModelHooks<CoinWalletChangeModel>> = {
    async afterCreate (record) {
      await record.updateAccumulatedCoin();
    },
  }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = {
    byType (type) {
      return { where: { type } };
    },
    byUser (userId) {
      return { where: { userId } };
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
  }

  private async updateAccumulatedCoin () {
    const user = await UserModel.findByPk(this.userId);
    await user.update({ coinReward: user.coinReward + this.amount });
  }

  public static initialize (sequelize: Sequelize) {
    this.init(CoinWalletChangeEntity, {
      hooks: CoinWalletChangeModel.hooks,
      scopes: CoinWalletChangeModel.scopes,
      validate: CoinWalletChangeModel.validations,
      tableName: 'coin_wallet_changes',
      sequelize,
    });
  }

  public static associate () {
  }
}

export default CoinWalletChangeModel;
