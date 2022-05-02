import SubOrderEntity from '@entities/subOrders';
import SubOrderInterface from '@interfaces/subOrders';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import OrderItemModel from './orderItems';
import OrderModel from './orders';
import WarehouseModel from './warehouses';

class SubOrderModel extends Model<SubOrderInterface> implements SubOrderInterface {
public id: number;
public code: string;
public orderId: number;
public warehouseId: number;
public subTotal: number;
public shippingFee: number;
public shippingDiscount?: number;
public total: number;
public weight: number;
public length: number;
public width: number;
public height: number;
public shippingFeeMisa: number;
public deposit: number;
public deliveryType: string;
public deliveryInfo: string;
public note: string;
public shippingType: string;
public shippingAttributeType: string;
public shippingCode?: string;
public status?: string;
public orderFinishAt?: Date;
public pickUpAt?: Date;
public createdAt?: Date;
public updatedAt?: Date;
public deletedAt?: Date;

public warehouse?: WarehouseModel;
public items?: OrderItemModel[];

static readonly STATUS_ENUM = { DRAFT: 'draft' }

static readonly hooks: Partial<ModelHooks<SubOrderModel>> = {
  async beforeCreate (record: SubOrderModel) {
    record.code = await this.generateOderCode();
  },
}

  static readonly validations: ModelValidateOptions = {
    async validateWarehouse () {
      const warehouse = await WarehouseModel.scope([
        'withWarehouseVariant',
        { method: ['byId', this.warehouseId] },
      ]).findOne();
      if (!warehouse) {
        throw new ValidationErrorItem('Kho hàng không tồn tại', 'validateWarehouse', 'warehouseId', this.warehouseId);
      }
      for (const warehouseVariant of warehouse.warehouseVariant) {
        const item = this.items.find((record: any) => record.productVariantId === warehouseVariant.variantId);
        if (item && item.quantity > warehouseVariant.quantity) {
          throw new ValidationErrorItem('Sản phẩm kho hàng không hợp lệ', 'validateWarehouse', 'warehouseId', this.warehouseId);
        }
      }
    },
    async validateDeposit () {
      if (this.deposit < 0) {
        throw new ValidationErrorItem('Tiền đặt cọc không được nhỏ hơn 0', 'validateDeposit', 'deposit', this.deposit);
      }
    },
    async validateShippingFee () {
      if (this.shippingFee < 0) {
        throw new ValidationErrorItem('Phí giao hàng không được nhỏ hơn 0', 'validateShippingFee', 'shippingFee', this.shippingFee);
      }
    },
  }

  public static async generateOderCode () {
    let code = '';
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 12; i > 0; --i) code += characters[Math.floor(Math.random() * characters.length)];
    const existCode = await SubOrderModel.scope([{ method: ['byCode', code] }]).findOne();
    if (existCode) code = await this.generateOderCode();
    return code;
  }

  static readonly scopes: ModelScopeOptions = {
    byCode (code) {
      return {
        where: { code },
      };
    },
    withItem () {
      return {
        include: [{
          model: OrderItemModel,
          as: 'items',
        }],
      };
    },
    byId (id) {
      return {
        where: { id },
      };
    },
    bySortOrder (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    withOrder () {
      return {
        include: [{
          model: OrderModel,
          as: 'order',
          attributes: {
            exclude: [
              'createdAt', 'updatedAt', 'transactionId', 'paidAt', 'portalConfirmAt', 'deletedAt',
            ],
            include: [
              [Sequelize.literal('(SELECT title FROM m_districts WHERE misaCode = order.shippingDistrictId)'), 'districtName'],
              [Sequelize.literal('(SELECT title FROM m_wards WHERE misaCode = order.shippingWardId)'), 'wardName'],
              [Sequelize.literal('(SELECT title FROM m_provinces WHERE misaCode = order.shippingProvinceId)'), 'provinceName'],
            ],
          },
        }],
      };
    },
    byUser (ownerId) {
      return {
        include: [{
          model: OrderModel,
          as: 'order',
          where: { ownerId },
        }],
      };
    },
    byStatus (status) {
      return {
        where: { status },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(SubOrderEntity, {
      hooks: SubOrderModel.hooks,
      scopes: SubOrderModel.scopes,
      validate: SubOrderModel.validations,
      tableName: 'sub_orders',
      sequelize,
    });
  }

  public static associate () {
    this.hasMany(OrderItemModel, { as: 'items', foreignKey: 'subOrderId' });
    this.belongsTo(OrderModel, { as: 'order', foreignKey: 'orderId' });
    this.belongsTo(WarehouseModel, { as: 'warehouse', foreignKey: 'warehouseId' });
  }
}

export default SubOrderModel;
