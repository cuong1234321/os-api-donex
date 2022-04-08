import WarehouseReceiptVariantEntity from '@entities/warehouseReceiptVariants';
import WarehouseReceiptVariantInterface from '@interfaces/warehouseReceiptVariants';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import ProductVariantModel from './productVariants';
import WarehouseModel from './warehouses';
import WarehouseVariantModel from './warehouseVariants';

class WarehouseReceiptVariantModel extends Model<WarehouseReceiptVariantInterface> implements WarehouseReceiptVariantInterface {
  public id: number;
  public warehouseReceiptId: number;
  public variantId: number;
  public warehouseId: number;
  public quantity: number;
  public price: number;
  public totalPrice: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'variantId', 'warehouseId', 'quantity', 'price', 'totalPrice']

  static readonly hooks: Partial<ModelHooks<WarehouseReceiptVariantModel>> = {
    async afterSave (record) {
      const warehouseVariant = (await WarehouseVariantModel.findOrCreate({
        where: {
          warehouseId: record.warehouseId,
          variantId: record.variantId,
        },
        defaults: {
          id: undefined,
          warehouseId: record.warehouseId,
          variantId: record.variantId,
          quantity: 0,
        },
      }))[0];
      await warehouseVariant.update({ quantity: warehouseVariant.quantity - (record.previous('quantity') || 0) + (record.quantity || 0) });
    },
    async afterDestroy (record) {
      const warehouseVariant = await WarehouseVariantModel.scope([
        { method: ['byWarehouseId', record.warehouseId] },
        { method: ['byProductVariant', record.variantId] },
      ]).findOne();
      await warehouseVariant.update({ quantity: warehouseVariant.quantity - record.quantity });
    },
  }

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
    this.belongsTo(ProductVariantModel, { as: 'variant', foreignKey: 'variantId' });
    this.belongsTo(WarehouseModel, { as: 'warehouse', foreignKey: 'warehouseId' });
  }
}

export default WarehouseReceiptVariantModel;
