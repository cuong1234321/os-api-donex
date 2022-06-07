import AdminWarehouseEntity from '@entities/adminWarehouses';
import AdminWarehouseInterface from '@interfaces/adminWarehouses';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class AdminWarehouseModel extends Model<AdminWarehouseInterface> implements AdminWarehouseInterface {
  public id: number;
  public adminId: number;
  public warehouseId: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly hooks: Partial<ModelHooks<AdminWarehouseModel>> = { }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = { }

  public static initialize (sequelize: Sequelize) {
    this.init(AdminWarehouseEntity, {
      hooks: AdminWarehouseModel.hooks,
      scopes: AdminWarehouseModel.scopes,
      validate: AdminWarehouseModel.validations,
      tableName: 'admin_warehouses',
      sequelize,
    });
  }

  public static associate () { }
}

export default AdminWarehouseModel;
