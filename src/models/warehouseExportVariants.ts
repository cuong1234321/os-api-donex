import WarehouseExportVariantEntity from '@entities/warehouseExportVariants';
import WarehouseExportVariantInterface from '@interfaces/warehouseExportVariants';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import ProductVariantModel from './productVariants';
import WarehouseModel from './warehouses';
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

  static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'variantId', 'warehouseId', 'quantity', 'price', 'totalPrice']

  static readonly hooks: Partial<ModelHooks<WarehouseExportVariantModel>> = {
    async afterSave (record) {
      const warehouseVariant = await WarehouseVariantModel.scope([
        { method: ['byWarehouseId', record.warehouseId] },
        { method: ['byProductVariant', record.variantId] },
      ]).findOne();
      if (warehouseVariant) {
        await warehouseVariant.update({ quantity: warehouseVariant.quantity + (record.previous('quantity') || 0) - (record.quantity || 0) });
      }
    },
    async afterDestroy (record) {
      const warehouseVariant = await WarehouseVariantModel.scope([
        { method: ['byWarehouseId', record.warehouseId] },
        { method: ['byProductVariant', record.variantId] },
      ]).findOne();
      await warehouseVariant.update({ quantity: warehouseVariant.quantity + record.quantity });
    },
    beforeCreate (record) {
      record.totalPrice = record.quantity * record.price;
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
    async validateVariant () {
      const warehouseVariant = await WarehouseVariantModel.scope([
        { method: ['byWarehouseId', this.warehouseId] },
        { method: ['byProductVariant', this.variantId] },
      ]).findOne();
      if (!warehouseVariant) {
        throw new ValidationErrorItem('Kho không tồn tại sản phẩm.', 'validateVariant', 'variantId', this.variantId);
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
    this.belongsTo(ProductVariantModel, { as: 'variant', foreignKey: 'variantId' });
    this.belongsTo(WarehouseModel, { as: 'warehouse', foreignKey: 'warehouseId' });
  }
}

export default WarehouseExportVariantModel;
