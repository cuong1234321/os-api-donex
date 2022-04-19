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
public shippingCode?: string;
public status?: string;
public orderFinishAt?: Date;
public createdAt?: Date;
public updatedAt?: Date;
public deletedAt?: Date;

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
  }
}

export default SubOrderModel;
