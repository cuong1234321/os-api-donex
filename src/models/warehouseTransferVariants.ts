import WarehouseTransferVariantEntity from '@entities/warehouseTransferVariants';
import WarehouseTransferVariantInterface from '@interfaces/warehouseTransferVariants';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class WarehouseTransferVariantModel extends Model<WarehouseTransferVariantInterface> implements WarehouseTransferVariantInterface {
  public id: number;
  public warehouseTransferId: number;
  public variantId: number;
  public quantity: number;
  public price: number;
  public totalPrice: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly hooks: Partial<ModelHooks<WarehouseTransferVariantModel>> = {}

  static readonly validations: ModelValidateOptions = {}

  static readonly scopes: ModelScopeOptions = {}

  public static initialize (sequelize: Sequelize) {
    this.init(WarehouseTransferVariantEntity, {
      hooks: WarehouseTransferVariantModel.hooks,
      scopes: WarehouseTransferVariantModel.scopes,
      validate: WarehouseTransferVariantModel.validations,
      tableName: 'warehouse_transfer_variants',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
  }
}

export default WarehouseTransferVariantModel;
