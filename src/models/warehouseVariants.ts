import WarehouseVariantEntity from '@entities/warehouseVariants';
import WarehouseVariantInterface from '@interfaces/warehouseVariants';
import dayjs from 'dayjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import ProductCategoryModel from './productCategories';
import ProductCategoryRefModel from './productCategoryRefs';
import ProductModel from './products';
import ProductVariantModel from './productVariants';
import WarehouseModel from './warehouses';

class WarehouseVariantModel extends Model<WarehouseVariantInterface> implements WarehouseVariantInterface {
  public id: number;
  public warehouseId: number;
  public variantId: number;
  public quantity: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly hooks: Partial<ModelHooks<WarehouseVariantModel>> = {}

  static readonly validations: ModelValidateOptions = {}

  static readonly scopes: ModelScopeOptions = {
    byWarehouseId (warehouseId) {
      return {
        where: { warehouseId },
      };
    },
    byProductVariant (variantId) {
      return {
        where: { variantId },
      };
    },
    withWarehouse () {
      return {
        include: [{
          model: WarehouseModel,
          as: 'warehouse',
          required: true,
        }],
      };
    },
    byEnoughQuantityVariant (quantity, variantId, warehouseId) {
      return {
        where: {
          [Op.and]: [
            { variantId },
            { warehouseId },
            { quantity: { [Op.gte]: quantity } },
          ],
        },
      };
    },
    byProduct (productId) {
      return {
        include: [
          {
            model: ProductVariantModel,
            as: 'variants',
            where: { productId },
          },
        ],
      };
    },
    withVariantDetail () {
      return {
        include: [
          {
            model: ProductVariantModel,
            as: 'variants',
            attributes: {
              include: [
                [
                  Sequelize.literal('(SELECT unit FROM products WHERE id = `variants`.productId)'),
                  'unit',
                ],
                [
                  Sequelize.literal(`(select name from product_categories where type = '${ProductCategoryModel.TYPE_ENUM.NONE}' and ` +
                  'id = (select productCategoryId from product_category_refs where productId = `variants`.productId limit 1 ))'),
                  'productCategoryName',
                ],
              ],
            },
          },
        ],
      };
    },
    byQuantityDetail (from, to) {
      from = !from ? dayjs('2000').startOf('year').format() : dayjs(from).startOf('day').format();
      to = !to ? dayjs('3000').startOf('year').format() : dayjs(to).endOf('day').format();
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(warehouseReceiptVariants.quantity) FROM warehouseReceiptVariants INNER JOIN warehouseReceipts ON warehouseReceipts.id = warehouseReceiptVariants.warehouseReceiptId ' +
              'WHERE warehouseReceiptVariants.variantId = WarehouseVariantModel.variantId AND warehouseReceiptVariants.warehouseId = WarehouseVariantModel.warehouseId ' +
              `AND warehouseReceipts.importDate BETWEEN "${from}" AND "${to}" AND warehouseReceiptVariants.deletedAt IS NULL)`), 'SIGNED'),
              'totalQuantityImport',
            ],
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(warehouse_export_variants.quantity) FROM warehouse_export_variants INNER JOIN warehouse_exports ON warehouse_exports.id = warehouse_export_variants.warehouseExportId ' +
              'WHERE warehouse_export_variants.variantId = WarehouseVariantModel.variantId AND warehouse_export_variants.warehouseId = WarehouseVariantModel.warehouseId ' +
              `AND warehouse_exports.exportDate BETWEEN "${from}" AND "${to}" AND warehouse_export_variants.deletedAt IS NULL)`), 'SIGNED'),
              'totalQuantityExport',
            ],
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(warehouse_transfer_variants.quantity) FROM warehouse_transfer_variants INNER JOIN warehouse_transfers ON warehouse_transfers.id = warehouse_transfer_variants.warehouseTransferId ' +
              'WHERE warehouse_transfer_variants.variantId = WarehouseVariantModel.variantId AND warehouse_transfers.toWarehouseId = WarehouseVariantModel.warehouseId ' +
              `AND warehouse_transfers.transferDate BETWEEN "${from}" AND "${to}" AND warehouse_transfers.status = "confirm" AND warehouse_transfer_variants.deletedAt IS NULL)`), 'SIGNED'),
              'quantityTransferImport',
            ],
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(warehouse_transfer_variants.quantity) FROM warehouse_transfer_variants INNER JOIN warehouse_transfers ON warehouse_transfers.id = warehouse_transfer_variants.warehouseTransferId ' +
              'WHERE warehouse_transfer_variants.variantId = WarehouseVariantModel.variantId AND warehouse_transfers.fromWarehouseId = WarehouseVariantModel.warehouseId ' +
              `AND warehouse_transfers.transferDate BETWEEN "${from}" AND "${to}" AND warehouse_transfers.status = "confirm" AND warehouse_transfer_variants.deletedAt IS NULL)`), 'SIGNED'),
              'quantityTransferExport',
            ],
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(warehouse_transfer_variants.quantity) FROM warehouse_transfer_variants INNER JOIN warehouse_transfers ON warehouse_transfers.id = warehouse_transfer_variants.warehouseTransferId ' +
              'WHERE warehouse_transfer_variants.variantId = WarehouseVariantModel.variantId AND warehouse_transfers.fromWarehouseId = WarehouseVariantModel.warehouseId ' +
              `AND warehouse_transfers.transferDate BETWEEN "${from}" AND "${to}" AND warehouse_transfers.status = "pending" AND warehouse_transfer_variants.deletedAt IS NULL)`), 'SIGNED'),
              'quantityMovingTransfer',
            ],
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(warehouse_transfer_variants.quantity) FROM warehouse_transfer_variants INNER JOIN warehouse_transfers ON warehouse_transfers.id = warehouse_transfer_variants.warehouseTransferId ' +
              'WHERE warehouse_transfer_variants.variantId = WarehouseVariantModel.variantId AND warehouse_transfers.toWarehouseId = WarehouseVariantModel.warehouseId ' +
              `AND warehouse_transfers.transferDate BETWEEN "${from}" AND "${to}" AND warehouse_transfers.status = "pending" AND warehouse_transfer_variants.deletedAt IS NULL)`), 'SIGNED'),
              'quantityComingTransfer',
            ],
          ],
        },
      };
    },
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    byProuctCategoryId (categoryId) {
      return {
        include: [
          {
            model: ProductVariantModel,
            as: 'variants',
            required: true,
            include: [{
              model: ProductModel,
              as: 'product',
              required: true,
              attributes: ['id'],
              include: [
                {
                  model: ProductCategoryRefModel,
                  as: 'categoryRefs',
                  required: true,
                  where: {
                    productCategoryId: categoryId,
                  },
                },
              ],
            }],
          },
        ],
      };
    },
    byFreeWord (freeWord) {
      return {
        include: [
          {
            model: ProductVariantModel,
            as: 'variants',
            where: {
              [Op.or]: [
                { skuCode: freeWord },
                { name: { [Op.like]: `%${freeWord || ''}%` } },
              ],
            },
          },
        ],
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(WarehouseVariantEntity, {
      hooks: WarehouseVariantModel.hooks,
      scopes: WarehouseVariantModel.scopes,
      validate: WarehouseVariantModel.validations,
      tableName: 'warehouse_variants',
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(WarehouseModel, { as: 'warehouse', foreignKey: 'warehouseId' });
    this.belongsTo(ProductVariantModel, { as: 'variants', foreignKey: 'variantId' });
  }
}

export default WarehouseVariantModel;
