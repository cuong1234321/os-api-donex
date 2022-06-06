import OrderItemEntity from '@entities/orderItems';
import OrderItemInterface from '@interfaces/orderItems';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
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

  static readonly validations: ModelValidateOptions = { }

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
