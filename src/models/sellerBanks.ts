import SellerBankEntity from '@entities/sellerBanks';
import SellerBankInterface from '@interfaces/sellerBanks';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import MBankModel from './mBanks';

class SellerBankModel extends Model<SellerBankInterface> implements SellerBankInterface {
  public id: number;
  public sellerId: number;
  public bankId: number;
  public branch: string;
  public ownerName: string;
  public accountNumber: string;
  public isDefaultAccount: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly CREATABLE_PARAMETERS = ['bankId', 'branch', 'ownerName', 'accountNumber', 'isDefaultAccount'];
  static readonly UPDATABLE_PARAMETERS = ['bankId', 'branch', 'ownerName', 'accountNumber', 'isDefaultAccount'];

  static readonly hooks: Partial<ModelHooks<SellerBankModel>> = { }

  static readonly validations: ModelValidateOptions = {
    async validateDefaultAccount () {
      if (this.isDefaultAccount) {
        const totalDefaultAccount = await SellerBankModel.scope([
          { method: ['bySeller', this.sellerId] },
          'isDefaultAccount',
        ]).count({ where: { id: { [Op.ne]: this.id } } });
        if (totalDefaultAccount > 0) { throw new ValidationErrorItem('Chỉ được phép cài đặt 1 tài khoản làm tài khoản mặc định.', 'validateDefaultAccount', 'totalDefaultAccount', this.isDefaultAccount); }
      }
    },
  }

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return { where: { id } };
    },
    bySeller (sellerId) {
      return { where: { sellerId } };
    },
    isDefaultAccount () {
      return {
        where: { isDefaultAccount: true },
      };
    },
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    withBank () {
      return { include: [{ model: MBankModel, as: 'bank' }] };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(SellerBankEntity, {
      scopes: SellerBankModel.scopes,
      validate: SellerBankModel.validations,
      tableName: 'seller_banks',
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(MBankModel, { as: 'bank', foreignKey: 'bankId' });
  }
}

export default SellerBankModel;
