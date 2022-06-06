import SellerWarehouseEntity from '@entities/sellerWarehouses';
import SellerWarehouseInterface from '@interfaces/sellerWarehouses';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class SellerWarehouseModel extends Model<SellerWarehouseInterface> implements SellerWarehouseInterface {
  public id: number;
  public adminId: number;
  public warehouseId: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly hooks: Partial<ModelHooks<SellerWarehouseModel>> = { }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = { }

  public static initialize (sequelize: Sequelize) {
    this.init(SellerWarehouseEntity, {
      hooks: SellerWarehouseModel.hooks,
      scopes: SellerWarehouseModel.scopes,
      validate: SellerWarehouseModel.validations,
      tableName: 'seller_warehouses',
      sequelize,
    });
  }

  public static associate () { }
}

export default SellerWarehouseModel;
