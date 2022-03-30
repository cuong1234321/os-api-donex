import VoucherApplicationEntity from '@entities/voucherApplications';
import VoucherApplicationInterface from '@interfaces/voucherApplications';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import VoucherModel from './vouchers';

class VoucherApplicationModel extends Model<VoucherApplicationInterface> implements VoucherApplicationInterface {
  public id: number;
  public title: string;
  public type: string;
  public amount: string;
  public appliedAt: Date;
  public appliedTo: Date;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly hooks: Partial<ModelHooks<VoucherApplicationModel>> = { }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = { }

  public static initialize (sequelize: Sequelize) {
    this.init(VoucherApplicationEntity, {
      hooks: VoucherApplicationModel.hooks,
      scopes: VoucherApplicationModel.scopes,
      validate: VoucherApplicationModel.validations,
      tableName: 'voucher_applications',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.hasMany(VoucherModel, { as: 'vouchers', foreignKey: 'voucherApplicationId' });
  }
}

export default VoucherApplicationModel;
