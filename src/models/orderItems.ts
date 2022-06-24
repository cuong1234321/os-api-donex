import OrderItemEntity from '@entities/orderItems';
import OrderItemInterface from '@interfaces/orderItems';
import dayjs from 'dayjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import ProductModel from './products';
import ProductVariantModel from './productVariants';
import SubOrderModel from './subOrders';

class OrderItemModel extends Model<OrderItemInterface> implements OrderItemInterface {
  public id: number;
  public subOrderId: number;
  public productVariantId: number;
  public quantity: number;
  public sellingPrice: number;
  public listedPrice: number;
  public commission: number;
  public saleCampaignDiscount: number;
  public saleCampaignId: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public variant?: ProductVariantModel;

  static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'productVariantId', 'quantity', 'saleCampaignId', 'sellingPrice'];

  static readonly hooks: Partial<ModelHooks<OrderItemModel>> = {
  }

  static readonly validations: ModelValidateOptions = {
    validateSellingprice () {
      if (this.sellingPrice / this.listedPrice > 1 || this.sellingPrice / this.listedPrice < 0.65) {
        throw new ValidationErrorItem('Giá bán không hợp lệ.', 'validateSellingprice', 'sellingPrice', this.sellingPrice);
      }
    },
  }

  static readonly scopes: ModelScopeOptions = {
    withProductVariant () {
      return {
        include: [
          {
            model: ProductVariantModel,
            as: 'variant',
            include: [
              {
                model: ProductModel,
                as: 'product',
              },
            ],
          },
        ],
      };
    },
    bySubOrder (subOrderId) {
      return {
        where: { subOrderId },
      };
    },
    bySortOrder (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    withSubOrderFinish () {
      return {
        include: [
          {
            model: SubOrderModel,
            as: 'subOrder',
            where: { status: SubOrderModel.STATUS_ENUM.WAITING_TO_TRANSFER },
            required: true,
            attributes: [],
          },
        ],
      };
    },
    withBuyerName () {
      return {
        attributes: {
          include: [
            [Sequelize.literal('(SELECT shippingFullName FROM orders where id = (SELECT orderId FROM sub_orders WHERE id = (SELECT subOrderId FROM order_items WHERE id = OrderItemModel.id)))'), 'buyerName'],
          ],
        },
      };
    },
    withProductUnit () {
      return {
        attributes: {
          include: [
            [Sequelize.literal('(SELECT unit FROM products where id = (SELECT productId FROM product_variants WHERE id = (SELECT productVariantId FROM order_items WHERE id = OrderItemModel.id)))'), 'unit'],
            [Sequelize.literal('(SELECT name FROM product_variants where id = OrderItemModel.productVariantId)'), 'productName'],
          ],
        },
      };
    },
    byCreatedAt (from, to) {
      if (!from && !to) return { where: {} };
      const createdAtCondition: any = {};
      if (from) Object.assign(createdAtCondition, { [Op.gt]: dayjs(from as string).startOf('day').format() });
      if (to) Object.assign(createdAtCondition, { [Op.lte]: dayjs(to as string).endOf('day').format() });
      return {
        where: { createdAt: createdAtCondition },
      };
    },
    byFreeWord (freeWord) {
      return {
        where: {
          id: { [Op.in]: [Sequelize.literal(`(SELECT id FROM order_items where productVariantId in (SELECT id FROM product_variants WHERE name like "%${freeWord}%"))`)] },
        },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(OrderItemEntity, {
      hooks: OrderItemModel.hooks,
      scopes: OrderItemModel.scopes,
      validate: OrderItemModel.validations,
      tableName: 'order_items',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(SubOrderModel, { as: 'subOrder', foreignKey: 'subOrderId' });
    this.belongsTo(ProductVariantModel, { as: 'variant', foreignKey: 'productVariantId' });
  }
}

export default OrderItemModel;
