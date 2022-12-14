import WarehouseTransferVariantEntity from '@entities/warehouseTransferVariants';
import WarehouseTransferVariantInterface from '@interfaces/warehouseTransferVariants';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import WarehouseTransferModel from './warehouseTransfers';
import WarehouseVariantModel from './warehouseVariants';
import ProductVariantModel from './productVariants';

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

  public mainSku?: string;
  public sizeTitle?: string;

  static readonly hooks: Partial<ModelHooks<WarehouseTransferVariantModel>> = {
    async afterSave (record, options) {
      const warehouseTransfer = await WarehouseTransferModel.findByPk(record.warehouseTransferId, { transaction: options.transaction });
      const warehouseVariant = await WarehouseVariantModel.scope([
        { method: ['byWarehouseId', warehouseTransfer.fromWarehouseId] },
        { method: ['byProductVariant', record.variantId] },
      ]).findOne();
      if (warehouseTransfer) {
        await warehouseVariant.update({ quantity: warehouseVariant.quantity + (record.previous('quantity') || 0) - (record.quantity || 0) }, { transaction: options.transaction });
      }
    },
    beforeCreate (record) {
      record.totalPrice = record.quantity * record.price;
    },
  }

  static readonly validations: ModelValidateOptions = {
    async validateQuantity () {
      if (this.quantity && this.quantity < 0) {
        throw new ValidationErrorItem('Số lượng sản phẩm không là số âm ', 'validateQuantity', 'quantity', this.quantity);
      }
    },
    async validatePrice () {
      if (this.price && this.price < 0) {
        throw new ValidationErrorItem('Giá sản phẩm không là số âm ', 'validatePrice', 'price', this.price);
      }
    },
  }

  static readonly scopes: ModelScopeOptions = {
    byWarehouseTransfer (warehouseTransferId) {
      return {
        where: { warehouseTransferId },
      };
    },
    withMainSkuVariant () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT mainSku FROM product_variants WHERE id = WarehouseTransferVariantModel.variantId)'),
              'mainSku',
            ],
          ],
        },
      };
    },
    withOptions () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT code FROM m_sizes INNER JOIN product_options ON product_options.value = m_sizes.id AND product_options.key = "size" AND product_options.deletedAt IS NULL ' +
              'INNER JOIN product_variant_options ON product_variant_options.optionId = product_options.id AND product_variant_options.deletedAt IS NULL ' +
              'WHERE product_variant_options.variantId = WarehouseTransferVariantModel.variantId LIMIT 1)'),
              'sizeTitle',
            ],
          ],
        },
      };
    },
  }

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
    this.belongsTo(ProductVariantModel, { as: 'variant', foreignKey: 'variantId' });
  }
}

export default WarehouseTransferVariantModel;
