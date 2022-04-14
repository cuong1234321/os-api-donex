import OrderEntity from '@entities/orders';
import OrderInterface from '@interfaces/orders';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import OrderItemModel from './orderItems';
import SubOrderModel from './subOrders';

class OrderModel extends Model<OrderInterface> implements OrderInterface {
  public id: number;
  public code: string;
  public ownerId: number;
  public orderableType: string;
  public orderableId: number;
  public creatableType: string;
  public creatableId: number;
  public paymentMethod: string;
  public saleChannel: string;
  public subTotal: number;
  public shippingFee: number;
  public shippingDiscount: number;
  public coinUsed: number;
  public total: number;
  public appliedVoucherId: number;
  public shippingFullName: string;
  public shippingPhoneNumber: number;
  public shippingProvinceId: number;
  public shippingDistrictId: number;
  public shippingWardId: number;
  public shippingAddress: string;
  public transactionId: string;
  public paidAt?: Date;
  public portalConfirmAt?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly USER_CREATABLE_PARAMETERS = ['paymentMethod', 'coinUsed', 'shippingFullName', 'shippingProvinceId',
    'shippingDistrictId', 'shippingPhoneNumber', 'shippingWardId', 'shippingAddress',
    {
      subOrders: [
        'warehouseId',
        { items: ['productVariantId', 'quantity'] },
      ],
    }]

  public static readonly ORDERABLE_TYPE_ENUM = { USER: 'user', COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor' }
  public static readonly CREATABLE_TYPE_ENUM = { USER: 'user', ADMIN: 'admin', COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor' }
  public static readonly PAYMENT_METHOD_ENUM = { BANKING: 'banking', COD: 'COD', VN_PAY: 'vnPay', WALLET: 'wallet' }
  public static readonly SALE_CHANNEL_ENUM = {
    FACEBOOK: 'facebook',
    LAZADA: 'lazada',
    SHOPEE: 'shopee',
    TIKI: 'tiki',
    WHOLESALE: 'wholesale',
    RETAIL: 'retail',
    OTHER: 'other',
  }

  static readonly hooks: Partial<ModelHooks<OrderModel>> = {
  }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = { }

  public static initialize (sequelize: Sequelize) {
    this.init(OrderEntity, {
      hooks: OrderModel.hooks,
      scopes: OrderModel.scopes,
      validate: OrderModel.validations,
      tableName: 'orders',
      sequelize,
    });
  }

  public static associate () {
    this.hasMany(SubOrderModel, { as: 'subOrders', foreignKey: 'orderId' });
    this.belongsToMany(OrderItemModel, { through: SubOrderModel, as: 'orderItems', foreignKey: 'orderId' });
  }
}

export default OrderModel;
