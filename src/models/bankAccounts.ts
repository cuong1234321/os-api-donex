import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, ValidationErrorItem } from 'sequelize';
import BankAccountEntity from '@entities/bankAccounts';
import BankAccountInterface from '@interfaces/bankAccounts';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import MBankModel from './mBanks';

class BankAccountModel extends Model<BankAccountInterface> implements BankAccountInterface {
  public id: number;
  public bankId: number;
  public bankAccount: string;
  public bankOwner: string;
  public qrCode: string;
  public status: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public static readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive' }
  public static readonly CREATABLE_PARAMETERS = ['bankId', 'bankAccount', 'bankOwner', 'qrCode', 'status']
  public static readonly UPDATABLE_PARAMETERS = ['bankId', 'bankOwner', 'qrCode', 'status', 'bankAccount']

  static readonly hooks: Partial<ModelHooks<BankAccountModel>> = {
  }

  static readonly validations: ModelValidateOptions = {
    async validateBank () {
      const bank = await MBankModel.findByPk(this?.bankId);
      if (!bank) {
        throw new ValidationErrorItem('Ngân hàng không tồn tại', 'validateBank', 'bankId', this.bankId);
      }
    },
  }

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return { where: { id } };
    },
    byStatus (status) {
      return {
        where: { status },
      };
    },
    withBank () {
      return {
        include: [
          {
            model: MBankModel,
            as: 'bank',
          },
        ],
      };
    },
    bySortOrder (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    byFreeWord (freeWord) {
      return {
        where: { bankOwner: { [Op.like]: `%${freeWord || ''}%` } },
      };
    },
    byBank (bankId) {
      return {
        where: { bankId },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(BankAccountEntity, {
      scopes: BankAccountModel.scopes,
      validate: BankAccountModel.validations,
      tableName: 'bank_accounts',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.belongsTo(MBankModel, { as: 'bank', foreignKey: 'bankId' });
  }
}

export default BankAccountModel;
