import OrderItemEntity from '@entities/orderItems';
import OrderItemInterface from '@interfaces/orderItems';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import OrderModel from './orders';
import SubOrderModel from './subOrders';

class OrderItemModel extends Model<OrderItemInterface> implements OrderItemInterface {
  public id: number;
  public subOrderId: number;
  public productVariantId: number;
  public quantity: number;
  public sellingPrice: number;
  public commission?: number;
  public saleCampaignId: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly hooks: Partial<ModelHooks<OrderItemModel>> = {
  }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = { }

  public static initialize (sequelize: Sequelize) {
    this.init(OrderItemEntity, {
      hooks: OrderItemModel.hooks,
      scopes: OrderItemModel.scopes,
      validate: OrderItemModel.validations,
      tableName: 'order_items',
      sequelize,
    });
  }

  public static associate () {
    this.belongsToMany(OrderModel, { through: SubOrderModel, as: 'orderItems', foreignKey: 'orderId' });
    this.belongsTo(SubOrderModel, { as: 'subOrder', foreignKey: 'subOrderId' });
  }
}

export default OrderItemModel;
