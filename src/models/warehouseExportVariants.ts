import WarehouseExportVariantEntity from '@entities/warehouseExportVariants';
import WarehouseExportVariantInterface from '@interfaces/warehouseExportVariants';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class WarehouseExportVariantModel extends Model<WarehouseExportVariantInterface> implements WarehouseExportVariantInterface {
  public id: number;
  public warehouseExportId: number;
  public variantId: number;
  public warehouseId: number;
  public quantity: number;
  public price: number;
  public totalPrice: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly hooks: Partial<ModelHooks<WarehouseExportVariantModel>> = {}

  static readonly validations: ModelValidateOptions = {}

  static readonly scopes: ModelScopeOptions = {}

  public static initialize (sequelize: Sequelize) {
    this.init(WarehouseExportVariantEntity, {
      hooks: WarehouseExportVariantModel.hooks,
      scopes: WarehouseExportVariantModel.scopes,
      validate: WarehouseExportVariantModel.validations,
      tableName: 'warehouse_export_variants',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
  }
}

export default WarehouseExportVariantModel;
