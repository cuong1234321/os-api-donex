import WarehouseReceiptVariantEntity from '@entities/warehouseReceiptVariants';
import WarehouseReceiptVariantInterface from '@interfaces/warehouseReceiptVariants';
import dayjs from 'dayjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import ProductVariantModel from './productVariants';
import SubOrderModel from './subOrders';
import WarehouseReceiptModel from './warehouseReceipts';
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

  public warehouseReceipt?: WarehouseReceiptModel;
  public skuCode?: string;
  public name?: string;
  public unit?: string;

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
    beforeCreate (record) {
      record.totalPrice = record.quantity * record.price;
    },
  }

  static readonly validations: ModelValidateOptions = {}

  static readonly scopes: ModelScopeOptions = {
    withVariantDetail () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal(`(SELECT unit FROM products WHERE products.id = (SELECT productId FROM product_variants 
                WHERE product_variants.id = WarehouseReceiptVariantModel.variantId))`), 'unit',
            ],
            [
              Sequelize.literal('(SELECT skuCode FROM product_variants WHERE id = WarehouseReceiptVariantModel.variantId)'), 'skuCode',
            ],
            [
              Sequelize.literal('(SELECT name FROM product_variants WHERE id = WarehouseReceiptVariantModel.variantId)'), 'name',
            ],
          ],
        },
      };
    },
    withSubOrder () {
      return {
        include: {
          model: WarehouseReceiptModel,
          as: 'warehouseReceipt',
          include: [
            {
              model: SubOrderModel,
              as: 'subOrder',
              attributes: {
                include: [
                  [
                    Sequelize.literal('(SELECT shippingFullName FROM orders WHERE id = `warehouseReceipt->subOrder`.orderId)'),
                    'shippingFullName',
                  ],
                ],
              },
            },
          ],
        },
      };
    },
    byWarehouseReceipt (warehouseReceiptId) {
      return {
        where: {
          warehouseReceiptId,
        },
      };
    },
    byDate (from, to) {
      if (!from && !to) return { where: {} };
      const createdAtCondition: any = {};
      if (from) Object.assign(createdAtCondition, { [Op.gt]: dayjs(from as string).startOf('day').format() });
      if (to) Object.assign(createdAtCondition, { [Op.lte]: dayjs(to as string).endOf('day').format() });
      return {
        include: {
          model: WarehouseReceiptModel,
          as: 'warehouseReceipt',
          required: true,
          include: [
            {
              model: SubOrderModel,
              as: 'subOrder',
              where: { createdAt: createdAtCondition },
            },
          ],
        },
      };
    },
    bySortOrder (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    byFreeWord (freeWord) {
      return {
        where: {
          [Op.or]: [
            {
              id: {
                [Op.in]: Sequelize.literal(`(SELECT warehouseReceiptVariants.id FROM warehouseReceiptVariants WHERE warehouseReceiptId 
                IN (SELECT warehouseReceipts.id FROM warehouseReceipts WHERE warehouseReceipts.orderId 
                IN (SELECT sub_orders.id FROM sub_orders WHERE sub_orders.code = "${freeWord}")))`),
              },
            },
            {
              id: {
                [Op.in]: Sequelize.literal(`(SELECT id FROM warehouseReceiptVariants WHERE variantId IN 
                (SELECT product_variants.id FROM product_variants WHERE name LIKE "%${freeWord}%" OR product_variants.skuCode = "${freeWord}"))`),
              },
            },
            {
              id: {
                [Op.in]: Sequelize.literal(`(SELECT warehouseReceiptVariants.id FROM warehouseReceiptVariants WHERE warehouseReceiptId IN 
                (SELECT warehouseReceipts.id FROM warehouseReceipts WHERE orderId IN 
                  (SELECT sub_orders.id FROM sub_orders INNER JOIN orders ON orders.id = sub_orders.orderId WHERE orders.shippingFullName LIKE "%${freeWord}%")))`),
              },
            },
          ],
        },
      };
    },
  }

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
    this.belongsTo(WarehouseReceiptModel, { as: 'warehouseReceipt', foreignKey: 'warehouseReceiptId' });
  }
}

export default WarehouseReceiptVariantModel;
