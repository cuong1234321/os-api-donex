import VoucherEntity from '@entities/vouchers';
import VoucherInterface from '@interfaces/vouchers';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import VoucherApplicationModel from './vourcherApplications';

class VoucherModel extends Model<VoucherInterface> implements VoucherInterface {
  public id: number;
  public voucherApplicationId: number;
  public discount: number;
  public userId: number;
  public activeAt: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly hooks: Partial<ModelHooks<VoucherModel>> = { }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = { }

  public static initialize (sequelize: Sequelize) {
    this.init(VoucherEntity, {
      hooks: VoucherModel.hooks,
      scopes: VoucherModel.scopes,
      validate: VoucherModel.validations,
      tableName: 'vouchers',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.belongsTo(VoucherApplicationModel, { as: 'application', foreignKey: 'voucherApplicationId' });
  }
}

export default VoucherModel;
