import MoneyWalletChangeEntity from '@entities/moneyWalletChanges';
import MoneyWalletChangeInterface from '@interfaces/moneyWalletChanges';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

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
  }

  static readonly hooks: Partial<ModelHooks<MoneyWalletChangeModel>> = {}

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = { }

  public static initialize (sequelize: Sequelize) {
    this.init(MoneyWalletChangeEntity, {
      hooks: MoneyWalletChangeModel.hooks,
      scopes: MoneyWalletChangeModel.scopes,
      validate: MoneyWalletChangeModel.validations,
      tableName: 'money_wallet_changes',
      sequelize,
    });
  }

  public static associate () { }
}

export default MoneyWalletChangeModel;
