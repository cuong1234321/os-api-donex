import settings from '@configs/settings';
import SubOrderEntity from '@entities/subOrders';
import OrderItemInterface from '@interfaces/orderItems';
import SubOrderInterface from '@interfaces/subOrders';
import Order from '@repositories/models/orders';
import dayjs from 'dayjs';
import { BelongsToGetAssociationMixin, HasManyGetAssociationsMixin, Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, Transaction, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import sequelize from '@initializers/sequelize';
import AdminModel from './admins';
import CoinWalletChangeModel from './coinWalletChanges';
import OrderItemModel from './orderItems';
import OrderModel from './orders';
import ProductVariantModel from './productVariants';
import SystemSettingModel from './systemSetting';
import UserModel from './users';
import WarehouseExportModel from './warehouseExports';
import WarehouseExportVariantModel from './warehouseExportVariants';
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
public paymentStatus: string;
public orderPartnerCode: string;
public billId: number;
public rankDiscount: number;
public voucherDiscount: number;
public coinUsed: number;
public coinDiscount: number;
public isAlreadyRating: boolean;
public cancelReason: string;
public cancelRequestAt: Date;
public cancelStatus: string;
public cancelableType: string;
public cancelableId: number;
public cancelRejectNote: string;
public tax: number;
public affiliateDiscount: number;
public expectedDeliveryTime: Date;
public otherDiscounts: string[];
public totalOtherDiscount: number;
public adminConfirmId: number;
public createdAt?: Date;
public updatedAt?: Date;
public deletedAt?: Date;

public warehouse?: WarehouseModel;
public items?: OrderItemModel[];

static readonly STATUS_ENUM = {
  DRAFT: 'draft',
  PENDING: 'pending',
  WAITING_TO_TRANSFER: 'waitingToTransfer',
  DELIVERY: 'delivery',
  WAITING_TO_PAY: 'waitingToPay',
  DELIVERED: 'delivered',
  FAIL: 'fail',
  RETURNED: 'returned',
  CANCEL: 'cancel',
  REJECT: 'reject',
  REFUND: 'refund',
  FINISH: 'finish',
}

static readonly DELIVERY_STATUS_ENUM = [
  'delivery',
  'waitingToPay',
]

static readonly SALE_CHANNEL_KEY: any = {
  facebook: 'FB',
  lazada: 'LA',
  shopee: 'SP',
  tiki: 'TK',
  wholesale: 'SI',
  retail: 'LE',
  other: 'KK',
}

static readonly CANCEL_STATUS = { PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected' }
static readonly CANCELABLE_TYPE_ENUM = { USER: 'user', COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor' };

static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'warehouseId', 'weight', 'length', 'width', 'height', 'pickUpAt', 'shippingFeeMisa',
  'shippingFee', 'deposit', 'deliveryType', 'deliveryInfo', 'note', 'shippingType', 'shippingAttributeType', 'subTotal', 'total'];

static readonly UPDATABLE_PARAMETERS = ['status'];

static readonly hooks: Partial<ModelHooks<SubOrderModel>> = {
  async afterCreate (record, options) {
    const order = await OrderModel.findByPk(record.orderId, { transaction: options.transaction });
    const totalOrder = await SubOrderModel.scope([{ method: ['byDate', dayjs().format('YYYY/MM/DD'), dayjs().format('YYYY/MM/DD')] }]).count();
    await record.update({ code: `${SubOrderModel.SALE_CHANNEL_KEY[order.saleChannel]}${dayjs().format('YYMMDD')}${String(totalOrder + 1).padStart(4, '0')}` }, { transaction: options.transaction });
  },
  async afterDestroy (record) {
    record.deleteSubOrderDetails();
  },
  async beforeSave (record: any) {
    if ([SubOrderModel.STATUS_ENUM.DRAFT, SubOrderModel.STATUS_ENUM.PENDING].includes(record._previousDataValues.status) && record.status === SubOrderModel.STATUS_ENUM.WAITING_TO_TRANSFER) {
      const order = await OrderModel.scope([
        'withAddress',
        { method: ['byId', record.orderId] },
      ]).findOne();
      const getOrderDetail = await record.formatOrder(record, order);
      const ghnOrder: any = await Order.createGhnOrder(getOrderDetail);
      record.orderPartnerCode = ghnOrder?.orderCode;
      record.expectedDeliveryTime = ghnOrder?.expectedDeliveryTime;
      if (order.creatableType === OrderModel.CREATABLE_TYPE.USER) {
        const user = await UserModel.scope([
          { method: ['byId', order.ownerId] },
        ]).findOne();
        user.update({ lastOrderFinishedAt: dayjs() });
      }
    }
  },
  async afterSave (record: any) {
    if (!this.isNewRecord) { await record.checkStatusSubOrder(); }
    if ((record.isNewRecord && record.status === SubOrderModel.STATUS_ENUM.PENDING) ||
      (record.previous('status') === SubOrderModel.STATUS_ENUM.DRAFT && ![SubOrderModel.STATUS_ENUM.REJECT, SubOrderModel.STATUS_ENUM.CANCEL].includes(record.status))
    ) {
      await SubOrderModel.createWarehouseExport(record);
    }
    if (record.previous('status') === SubOrderModel.STATUS_ENUM.PENDING && [SubOrderModel.STATUS_ENUM.REJECT, SubOrderModel.STATUS_ENUM.CANCEL].includes(record.status)) {
      const warehouseExport = await WarehouseExportModel.scope([{ method: ['byOrderId', record.id] }]).findOne();
      await warehouseExport.update({ status: WarehouseExportModel.STATUS_ENUM.CANCEL });
    }
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

  public async updateItems (items: any[], transaction?: Transaction) {
    if (!items) return;
    items.forEach((record: any) => {
      record.subOrderId = this.id;
    });
    const resultItems = await OrderItemModel.bulkCreate(items, {
      updateOnDuplicate: OrderItemModel.UPDATABLE_ON_DUPLICATE_PARAMETERS as (keyof OrderItemInterface)[],
      individualHooks: true,
      transaction,
    });
    await OrderItemModel.destroy({
      where: { subOrderId: this.id, id: { [Op.notIn]: resultItems.map((item) => item.id) } },
      individualHooks: true,
      transaction,
    });
  }

  public async formatOrder (subOrder: any, order: any) {
    const orderItems = await OrderItemModel.scope([
      'withProductVariant',
      { method: ['bySubOrder', subOrder.id] },
    ]).findAll();
    const params: any = {
      clientCode: subOrder.code,
      fullName: order.shippingFullName,
      userPhone: order.shippingPhoneNumber,
      address: order.shippingAddress,
      ghnWardCode: order.ward.ghnWardCode,
      ghnDistrictId: parseInt(order.district.ghnDistrictId),
      weight: subOrder.weight,
      length: subOrder.length,
      height: subOrder.height,
      width: subOrder.width,
      codAmount: subOrder.subTotal,
      items: [],
    };
    for (const orderItem of orderItems) {
      params.items.push(
        {
          name: orderItem?.variant?.name || 'sản phẩm',
          code: orderItem?.variant?.skuCode || '',
          quantity: orderItem?.quantity,
          price: orderItem?.sellingPrice,
          length: orderItem.variant?.product.length || 10,
          width: orderItem.variant?.product.width || 10,
          height: orderItem.variant?.product.height || 10,
        },
      );
    }
    return params;
  }

  public static async createWarehouseExport (subOrder: any) {
    const order = await OrderModel.scope([
      { method: ['byId', subOrder.orderId] },
    ]).findOne();
    const warehouseExportParams = SubOrderModel.formatWarehouseExport(subOrder, await subOrder.getItems(), order);
    await sequelize.transaction(async (transaction: Transaction) => {
      const warehouseExport = await WarehouseExportModel.create(warehouseExportParams, {
        include: [
          { model: WarehouseExportVariantModel, as: 'warehouseExportVariants' },
        ],
        transaction,
      });
      return warehouseExport;
    });
  }

  public static formatWarehouseExport (subOrder: any, orderItems: any, order: any) {
    const EXPORTABLE_MAPPING: any = { user: 'customer', agency: 'agency', distributor: 'distributor', collaborator: 'collaborator' };
    const params: any = {
      type: WarehouseExportModel.TYPE_ENUM.SELL,
      exportAbleType: EXPORTABLE_MAPPING[order.orderableType],
      exportAble: order.orderableId,
      exportDate: dayjs().format('YYYY/MM/DD'),
      orderId: subOrder.id,
      deliverer: subOrder.shippingType,
      warehouseExportVariants: [],
    };
    params.warehouseExportVariants = (orderItems).map((item: any) => {
      return {
        warehouseId: subOrder.warehouseId,
        variantId: item.productVariantId,
        quantity: item.quantity,
        price: item.sellingPrice,
      };
    });
    return params;
  }

  public async deleteSubOrderDetails () {
    await OrderItemModel.destroy({ where: { subOrderId: this.id }, individualHooks: true });
  }

  public async checkStatusSubOrder () {
    const systemSetting: any = (await SystemSettingModel.findOrCreate({
      where: { },
      defaults: { id: undefined },
    }))[0];
    const order = await this.getOrder();
    if (this.isNewRecord || !order?.ownerId || !order.paidAt) return;
    if (this.previous('status') !== SubOrderModel.STATUS_ENUM.REFUND && this.status === SubOrderModel.STATUS_ENUM.REFUND) {
      const params: any = {
        id: undefined,
        userId: order.ownerId,
        type: CoinWalletChangeModel.TYPE_ENUM.ADD,
        mutableType: CoinWalletChangeModel.MUTABLE_TYPE.ORDER_REFUND,
        mutableId: this.id,
        amount: Math.round(this.subTotal / (systemSetting.coinConversionLevel || 1000)),
      };
      await CoinWalletChangeModel.create(params);
    }
    if (this.previous('status') !== SubOrderModel.STATUS_ENUM.FINISH && this.status === SubOrderModel.STATUS_ENUM.FINISH) {
      const user = await UserModel.scope([
        { method: ['byId', order.ownerId] },
      ]).findOne();
      if (user.alreadyFinishOrder) return;
      await user.update({ alreadyFinishOrder: true });
      if (this.subTotal > settings.minMoneyUpRank && this.subTotal < settings.maxMoneyUpRank) {
        await user.update({ rank: UserModel.RANK_ENUM.VIP });
      }
    }
  }

  public getItems: HasManyGetAssociationsMixin<OrderItemModel>
  public getOrder: BelongsToGetAssociationMixin<OrderModel>

  static readonly scopes: ModelScopeOptions = {
    isNotDraft () {
      return {
        where: {
          status: { [Op.ne]: SubOrderModel.STATUS_ENUM.DRAFT },
        },
      };
    },
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
    byOrderId (orderId) {
      return {
        where: { orderId },
      };
    },
    byOrderAble (orderableId, orderableType) {
      return {
        include: [
          {
            model: OrderModel,
            as: 'order',
            where: {
              orderableId,
              orderableType,
            },
          },
        ],
      };
    },
    byPaymentStatus (paymentStatus) {
      return {
        where: { paymentStatus },
      };
    },
    bySaleChannel (saleChannel) {
      return {
        include: [{
          model: OrderModel,
          as: 'order',
          required: true,
          where: {
            saleChannel,
          },
        }],
      };
    },
    byCreateAdminName (name) {
      return {
        include: [{
          model: OrderModel,
          as: 'order',
          required: true,
          where: {
            creatableType: OrderModel.CREATABLE_TYPE.ADMIN,
          },
          include: [
            {
              model: AdminModel,
              as: 'creatableAdmin',
              where: {
                fullName: { [Op.like]: `%${name || ''}%` },
              },
              attributes: ['fullName'],
            },
          ],
        }],
      };
    },
    byShippingName (name) {
      return {
        include: [
          {
            model: OrderModel,
            as: 'order',
            where: {
              shippingFullName: { [Op.like]: `%${name || ''}%` },
            },
          },
        ],
      };
    },
    byPickUpAt (date) {
      return {
        where: {
          [Op.and]: [
            { pickUpAt: { [Op.gte]: dayjs(date as string).startOf('day').format() } },
            { pickUpAt: { [Op.lte]: dayjs(date as string).endOf('day').format() } },
          ],
        },
      };
    },
    byPhoneNumber (phoneNumber) {
      return {
        include: [
          {
            model: OrderModel,
            as: 'order',
            where: {
              shippingPhoneNumber: { [Op.like]: `%${phoneNumber || ''}%` },
            },
          },
        ],
      };
    },
    byCreatedAt (date) {
      return {
        where: {
          [Op.and]: [
            { createdAt: { [Op.gte]: dayjs(date as string).startOf('day').format() } },
            { createdAt: { [Op.lte]: dayjs(date as string).endOf('day').format() } },
          ],
        },
      };
    },
    byShippingType (type) {
      return {
        where: {
          shippingType: type,
        },
      };
    },
    byShippingCode (code) {
      return {
        where: {
          shippingCode: { [Op.like]: `%${code || ''}%` },
        },
      };
    },
    byOrderPartnerCode (code) {
      return {
        where: {
          orderPartnerCode: { [Op.like]: `%${code || ''}%` },
        },
      };
    },
    byPaymentMethod (paymentMethod) {
      return {
        include: [
          {
            model: OrderModel,
            as: 'order',
            where: { paymentMethod },
          },
        ],
      };
    },
    bySubTotalEq (value) {
      return {
        where: { subTotal: value },
      };
    },
    bySubTotalLte (value) {
      return {
        where: {
          subTotal: { [Op.lte]: value },
        },
      };
    },
    bySubTotalGte (value) {
      return {
        where: {
          subTotal: { [Op.gte]: value },
        },
      };
    },
    byShippingFeeEq (value) {
      return {
        where: { shippingFee: value },
      };
    },
    byShippingFeeLte (value) {
      return {
        where: {
          shippingFee: { [Op.lte]: value },
        },
      };
    },
    byShippingFeeGte (value) {
      return {
        where: {
          shippingFee: { [Op.gte]: value },
        },
      };
    },
    byShippingFeeMisaEq (value) {
      return {
        where: { shippingFeeMisa: value },
      };
    },
    byShippingFeeMisaLte (value) {
      return {
        where: {
          shippingFeeMisa: { [Op.lte]: value },
        },
      };
    },
    byShippingFeeMisaGte (value) {
      return {
        where: {
          shippingFeeMisa: { [Op.gte]: value },
        },
      };
    },
    byFinalAmountEq (value) {
      return {
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.literal('(SELECT (subTotal + shippingFee - deposit - rankDiscount - voucherDiscount - totalOtherDiscount) FROM sub_orders WHERE id = SubOrderModel.id)'), {
              [Op.between]: [value, value],
            }),
          ],
        },
      };
    },
    byFinalAmountLte (value) {
      return {
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.literal('(SELECT (subTotal + shippingFee - deposit - rankDiscount - voucherDiscount - totalOtherDiscount) FROM sub_orders WHERE id = SubOrderModel.id)'), {
              [Op.lte]: value,
            }),
          ],
        },
      };
    },
    byFinalAmountGte (value) {
      return {
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.literal('(SELECT (subTotal + shippingFee - deposit - rankDiscount - voucherDiscount - totalOtherDiscount) FROM sub_orders WHERE id = SubOrderModel.id)'), {
              [Op.gte]: value,
            }),
          ],
        },
      };
    },
    byDate (from, to) {
      if (!from && !to) return { where: {} };
      const createdAtCondition: any = {};
      if (from) Object.assign(createdAtCondition, { [Op.gte]: dayjs(from as string).startOf('day').format() });
      if (to) Object.assign(createdAtCondition, { [Op.lte]: dayjs(to as string).endOf('day').format() });
      return {
        where: { createdAt: createdAtCondition },
      };
    },
    withFinalAmount () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT (subTotal + shippingFee + tax - deposit - rankDiscount - voucherDiscount - totalOtherDiscount) FROM sub_orders WHERE id = SubOrderModel.id)'),
              'finalAmount',
            ],
          ],
        },
      };
    },
    withOrders () {
      return {
        include: [{
          model: OrderModel,
          as: 'order',
          attributes: {
            include: [
              [
                Sequelize.literal('(SELECT fullName FROM admins WHERE admins.id = order.creatableId)'),
                'createAbleName',
              ],
              [Sequelize.literal('(SELECT title FROM m_districts WHERE id = order.shippingDistrictId)'), 'districtName'],
              [Sequelize.literal('(SELECT title FROM m_wards WHERE id = order.shippingWardId)'), 'wardName'],
              [Sequelize.literal('(SELECT title FROM m_provinces WHERE id = order.shippingProvinceId)'), 'provinceName'],
            ],
          },
        }],
      };
    },
    withItems () {
      return {
        include: [
          {
            model: OrderItemModel,
            as: 'items',
            include: [
              {
                model: ProductVariantModel,
                as: 'variant',
                attributes: {
                  include: [
                    [
                      Sequelize.literal('(SELECT products.unit FROM products WHERE products.id = `items->variant`.productId)'),
                      'unit',
                    ],
                  ],
                },
              },
            ],
          },
        ],
      };
    },
    withIsNotRating () {
      return {
        where: { isAlreadyRating: false },
      };
    },
    withOrderInfo () {
      return {
        include: [
          {
            model: OrderModel,
            as: 'order',
          },
        ],
      };
    },
    withItemDetail () {
      return {
        include: [
          {
            model: OrderItemModel,
            as: 'items',
            attributes: {
              include: [
                [Sequelize.literal('(SELECT name FROM product_variants WHERE product_variants.id = `items.productVariantId`)'), 'productVariantName'],
                [Sequelize.literal('(SELECT skuCode FROM product_variants WHERE product_variants.id = `items.productVariantId`)'), 'skuCode'],
                [Sequelize.cast(Sequelize.literal('(SELECT sellingPrice * quantity / SubOrderModel.subTotal * SubOrderModel.rankDiscount FROM order_items WHERE order_items.id = `items.id`)'), 'SIGNED'), 'rankDiscount'],
              ],
            },
          },
        ],
      };
    },
    withWarehouseDetail () {
      return {
        include: [
          {
            model: WarehouseModel,
            as: 'warehouse',
            attributes: {
              exclude: ['type', 'status', 'phoneNumber', 'warehouseManager', 'createdAt', 'updatedAt', 'deletedAt', 'code'],
              include: [
                [Sequelize.literal('(SELECT title FROM m_districts WHERE id = `warehouse.districtId`)'), 'districtName'],
                [Sequelize.literal('(SELECT title FROM m_wards WHERE id = `warehouse.wardId`)'), 'wardName'],
                [Sequelize.literal('(SELECT title FROM m_provinces WHERE id = `warehouse.provinceId`)'), 'provinceName'],
              ],
            },
          },
        ],
      };
    },
    byCancelStatus (status) {
      return {
        where: {
          cancelStatus: status,
        },
      };
    },
    byTransportUnit (transportUnit) {
      return {
        include: [{
          model: OrderModel,
          as: 'order',
          where: { transportUnit },
        }],
      };
    },
    byReferralCode (referralCode) {
      return {
        include: [{
          model: OrderModel,
          as: 'order',
          where: { referralCode },
        }],
      };
    },
    byDeliveryStatus () {
      return {
        where: {
          status: { [Op.or]: [SubOrderModel.STATUS_ENUM.DELIVERY, SubOrderModel.STATUS_ENUM.WAITING_TO_PAY] },
        },
      };
    },
    totalListedPrice () {
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(listedPrice * quantity) FROM order_items WHERE subOrderId = SubOrderModel.id AND deletedAt IS NULL)'), 'SIGNED'), 'totalListedPrice',
            ],
          ],
        },
      };
    },
    totalSaleCampaignDiscount () {
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(saleCampaignDiscount * quantity) FROM order_items WHERE subOrderId = SubOrderModel.id AND deletedAt IS NULL)'), 'SIGNED'), 'totalSaleCampaignDiscount',
            ],
          ],
        },
      };
    },
    byOrderAbleType (orderableType) {
      return {
        include: [
          {
            model: OrderModel,
            as: 'order',
            where: {
              orderableType: orderableType,
            },
          },
        ],
      };
    },
    byWarehouse (warehouseId) {
      return {
        where: {
          warehouseId,
        },
      };
    },
    withPartnerCode () {
      return {
        where: { orderPartnerCode: { [Op.ne]: null } },
      };
    },
    withWarehouseExportId () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT id FROM warehouse_exports WHERE orderId = SubOrderModel.id LIMIT 1)'),
              'warehouseExportId',
            ],
          ],
        },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(SubOrderEntity, {
      hooks: SubOrderModel.hooks,
      scopes: SubOrderModel.scopes,
      validate: SubOrderModel.validations,
      tableName: 'sub_orders',
      paranoid: true,
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
