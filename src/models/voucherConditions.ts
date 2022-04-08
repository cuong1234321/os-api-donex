import VoucherConditionEntity from '@entities/voucherConditions';
import VoucherConditionInterface from '@interfaces/voucherConditions';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import VoucherApplicationModel from './voucherApplications';

class VoucherConditionModel extends Model<VoucherConditionInterface> implements VoucherConditionInterface {
  public id: number;
  public voucherApplicationId: number;
  public discountValue: number;
  public orderValue: number;
  public discountType: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'discountValue', 'orderValue'];

  static readonly DISCOUNT_TYPE_ENUM = { ACTIVE: 'cash', INACTIVE: 'percent' }

  static readonly hooks: Partial<ModelHooks<VoucherConditionModel>> = {
  }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = {
  }

  public static initialize (sequelize: Sequelize) {
    this.init(VoucherConditionEntity, {
      hooks: VoucherConditionModel.hooks,
      scopes: VoucherConditionModel.scopes,
      validate: VoucherConditionModel.validations,
      tableName: 'voucher_conditions',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(VoucherApplicationModel, { as: 'voucherApplication', foreignKey: 'voucherApplicationId' });
  }
}

export default VoucherConditionModel;
