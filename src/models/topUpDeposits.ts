import TopUpDepositEntity from '@entities/topUpDeposits';
import TopUpDepositInterface from '@interfaces/topUpDeposits';
import { HasOneSetAssociationMixin, Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
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
  static readonly CREATABLE_TYPE_ENUM = { ADMIN: 'admin', USER: 'user' }
  static readonly STATUS_ENUM = {
    PENDING: 'pending',
    COMPLETE: 'complete',
  };

  static readonly ADMIN_CREATABLE_PARAMETERS = ['ownerId', 'type', 'status', 'amount', 'note']
  static readonly ADMIN_UPDATABLE_PARAMETERS = ['ownerId', 'type', 'status', 'amount', 'note']

  static readonly hooks: Partial<ModelHooks<TopUpDepositModel>> = { }

  static readonly validations: ModelValidateOptions = { }

  public setMoneyWalletChange: HasOneSetAssociationMixin<MoneyWalletChangeModel, number>

  static readonly scopes: ModelScopeOptions = { }

  public static initialize (sequelize: Sequelize) {
    this.init(TopUpDepositEntity, {
      hooks: TopUpDepositModel.hooks,
      scopes: TopUpDepositModel.scopes,
      validate: TopUpDepositModel.validations,
      tableName: 'top_up_deposits',
      sequelize,
    });
  }

  public static associate () { }
}

export default TopUpDepositModel;
