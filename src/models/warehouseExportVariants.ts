import WarehouseExportVariantEntity from '@entities/warehouseExportVariants';
import WarehouseExportVariantInterface from '@interfaces/warehouseExportVariants';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import WarehouseVariantModel from './warehouseVariants';

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

  static readonly hooks: Partial<ModelHooks<WarehouseExportVariantModel>> = {
    async afterSave (record) {
      const warehouseVariant = await WarehouseVariantModel.scope([
        { method: ['byWarehouseId', record.warehouseId] },
        { method: ['byProductVariant', record.variantId] },
      ]).findOne();
      if (warehouseVariant) {
        await warehouseVariant.update({ quantity: warehouseVariant.quantity - (record.quantity || 0) });
      }
    },
  }

  static readonly validations: ModelValidateOptions = {
    async validateQuantity () {
      const warehouseVariant = await WarehouseVariantModel.scope([
        { method: ['byWarehouseId', this.warehouseId] },
        { method: ['byProductVariant', this.variantId] },
      ]).findOne();
      if (warehouseVariant && warehouseVariant.quantity < this.quantity) {
        throw new ValidationErrorItem('Số lượng sản phẩm không được lớn hơn số lượng sản phẩm trong kho.', 'validateQuantity', 'quantity', this.quantity);
      }
      if (this.quantity && this.quantity < 0) {
        throw new ValidationErrorItem('Số lượng sản phẩm không là số âm ', 'validateQuantity', 'quantity', this.quantity);
      }
    },
  }

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
