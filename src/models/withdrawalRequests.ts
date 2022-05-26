import WithdrawalRequestEntity from '@entities/withdrawalRequests';
import WithdrawalRequestInterface from '@interfaces/withdrawalRequests';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class WithdrawalRequestModel extends Model<WithdrawalRequestInterface> implements WithdrawalRequestInterface {
  public id: number;
  public code: string;
  public ownerId: number;
  public userBankId: number;
  public amount: number;
  public status: string;
  public approvalNote: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly CREATABLE_PARAMETERS = ['userBankId', 'amount']

  static readonly STATUS_ENUM = { PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected' }
  static readonly MINIMUM_WITHDRAWAL_AMOUNT = 50000
  static readonly MINIMUM_WALLET_AMOUNT = 200000

  static readonly hooks: Partial<ModelHooks<WithdrawalRequestModel>> = {}

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = { }

  public static initialize (sequelize: Sequelize) {
    this.init(WithdrawalRequestEntity, {
      hooks: WithdrawalRequestModel.hooks,
      scopes: WithdrawalRequestModel.scopes,
      validate: WithdrawalRequestModel.validations,
      tableName: 'withdrawal_requests',
      sequelize,
    });
  }

  public static associate () { }
}

export default WithdrawalRequestModel;
