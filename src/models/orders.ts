import settings from '@configs/settings';
import OrderEntity from '@entities/orders';
import OrderInterface from '@interfaces/orders';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import MDistrictModel from './mDistricts';
import MProvinceModel from './mProvinces';
import MWardModel from './mWards';
import OrderItemModel from './orderItems';
import SubOrderModel from './subOrders';
import UserModel from './users';
import VoucherModel from './vouchers';

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
  public promotionType: string;
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

  public static readonly ORDERABLE_TYPE = { USER: 'user', COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor' }
  public static readonly CREATABLE_TYPE = { USER: 'user', ADMIN: 'admin', COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor' }
  public static readonly PAYMENT_METHOD = { BANKING: 'banking', COD: 'COD', VN_PAY: 'vnPay', WALLET: 'wallet' }
  public static readonly PROMOTION_TYPE = { USER_BIRTHDAY: 'user_birthday', DONEX_BIRTHDAY: 'donex_birthday', SYSTEM_RANK: 'system_rank', USER_VOUCHER: 'user_voucher' }
  public static readonly SALE_CHANNEL = {
    FACEBOOK: 'facebook',
    LAZADA: 'lazada',
    SHOPEE: 'shopee',
    TIKI: 'tiki',
    WHOLESALE: 'wholesale',
    RETAIL: 'retail',
    OTHER: 'other',
  }

  static readonly hooks: Partial<ModelHooks<OrderModel>> = {
    async beforeCreate (record: OrderModel) {
      record.code = await this.generateOderCode();
    },
  }

  static readonly validations: ModelValidateOptions = {
    async validateShippingWard () {
      const ward = await MWardModel.findByPk(this.shippingWardId);
      if (!ward) {
        throw new ValidationErrorItem('Địa chỉ không hợp lệ', 'validateShippingWard', 'shippingWardId', this.shippingWardId);
      }
    },
    async validateShippingDistrict () {
      const ward = await MDistrictModel.findByPk(this.shippingWardId);
      if (!ward) {
        throw new ValidationErrorItem('Địa chỉ không hợp lệ', 'validateShippingDistrict', 'shippingDistrictId', this.shippingDistrictId);
      }
    },
    async validateShippingProvince () {
      const ward = await MProvinceModel.findByPk(this.shippingWardId);
      if (!ward) {
        throw new ValidationErrorItem('Địa chỉ không hợp lệ', 'validateShippingProvince', 'shippingProvinceId', this.shippingProvinceId);
      }
    },
    async validatePhoneNumber () {
      if (!settings.phonePattern.test(this.shippingPhoneNumber)) {
        throw new ValidationErrorItem('Số điện thoại không hợp lệ', 'validatePhoneNumber', 'shippingPhoneNumber', this.shippingPhoneNumber);
      }
    },
    async validateVoucher () {
      if (this.appliedVoucherId && this.promotionType === OrderModel.PROMOTION_TYPE.USER_VOUCHER) {
        const voucher = await VoucherModel.scope([
          { method: ['byUserVoucher', this.appliedVoucherId, this.orderableId, this.orderableType] },
        ]).findOne();
        if (!voucher) {
          throw new ValidationErrorItem('Voucher áp dụng không hợp lệ', 'validateVoucher', 'appliedVoucherId', this.appliedVoucherId);
        }
      }
    },
    async validateCoinUsed () {
      if (this.orderableType !== OrderModel.ORDERABLE_TYPE.USER) return;
      const user = await UserModel.findByPk(this.orderableId);
      if (user.coinReward < parseInt(this.coinUsed as string)) {
        throw new ValidationErrorItem('Số lượng điểm thưởng không hợp lệ', 'validateCoinUsed', 'coinUsed', this.coinUsed);
      }
    },
  }

  public static async generateOderCode () {
    let code = '';
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 12; i > 0; --i) code += characters[Math.floor(Math.random() * characters.length)];
    const existCode = await OrderModel.scope([{ method: ['byCode', code] }]).findOne();
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
