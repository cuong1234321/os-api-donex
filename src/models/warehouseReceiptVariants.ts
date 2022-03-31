import WarehouseReceiptVariantEntity from '@entities/warehouseReceiptVariants';
import WarehouseReceiptVariantInterface from '@interfaces/warehouseReceiptVariants';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class WarehouseReceiptVariantModel extends Model<WarehouseReceiptVariantInterface> implements WarehouseReceiptVariantInterface {
  public id: number;
  public warehouseReceiptId: number;
  public variantId: number;
  public warehouseId: number;
  public quantity: number;
  public price: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly hooks: Partial<ModelHooks<WarehouseReceiptVariantModel>> = {}

  static readonly validations: ModelValidateOptions = {}

  static readonly scopes: ModelScopeOptions = {}

  public static initialize (sequelize: Sequelize) {
    this.init(WarehouseReceiptVariantEntity, {
      hooks: WarehouseReceiptVariantModel.hooks,
      scopes: WarehouseReceiptVariantModel.scopes,
      validate: WarehouseReceiptVariantModel.validations,
      tableName: 'warehouseReceiptVariants',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
  }
}

export default WarehouseReceiptVariantModel;