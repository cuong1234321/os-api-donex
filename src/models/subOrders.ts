import SubOrderEntity from '@entities/subOrders';
import OrderItemInterface from '@interfaces/orderItems';
import SubOrderInterface from '@interfaces/subOrders';
import dayjs from 'dayjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, Transaction, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import AdminModel from './admins';
import OrderItemModel from './orderItems';
import OrderModel from './orders';
import ProductVariantModel from './productVariants';
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
public createdAt?: Date;
public updatedAt?: Date;
public deletedAt?: Date;

public warehouse?: WarehouseModel;
public items?: OrderItemModel[];

static readonly STATUS_ENUM = { DRAFT: 'draft', PENDING: 'pending' }

static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'warehouseId', 'weight', 'length', 'width', 'height', 'pickUpAt', 'shippingFeeMisa',
  'shippingFee', 'deposit', 'deliveryType', 'deliveryInfo', 'note', 'shippingType', 'shippingAttributeType', 'subTotal', 'total'];

static readonly hooks: Partial<ModelHooks<SubOrderModel>> = {
  async beforeCreate (record: SubOrderModel) {
    record.code = await this.generateOderCode();
  },
  async afterDestroy (record) {
    record.deleteSubOrderDetails();
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
            Sequelize.where(Sequelize.literal('(SELECT (subTotal + shippingFee - deposit) FROM sub_orders WHERE id = SubOrderModel.id)'), {
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
            Sequelize.where(Sequelize.literal('(SELECT (subTotal + shippingFee - deposit - rankDiscount) FROM sub_orders WHERE id = SubOrderModel.id)'), {
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
            Sequelize.where(Sequelize.literal('(SELECT (subTotal + shippingFee - deposit - rankDiscount) FROM sub_orders WHERE id = SubOrderModel.id)'), {
              [Op.gte]: value,
            }),
          ],
        },
      };
    },
    withFinalAmount () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT (subTotal + shippingFee - deposit - rankDiscount) FROM sub_orders WHERE id = SubOrderModel.id)'),
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
              [Sequelize.literal('(SELECT title FROM m_districts WHERE misaCode = order.shippingDistrictId)'), 'districtName'],
              [Sequelize.literal('(SELECT title FROM m_wards WHERE misaCode = order.shippingWardId)'), 'wardName'],
              [Sequelize.literal('(SELECT title FROM m_provinces WHERE misaCode = order.shippingProvinceId)'), 'provinceName'],
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
                      Sequelize.literal('(SELECT products.unit FROM products WHERE products.id = `items->variant`.id)'),
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

  public async deleteSubOrderDetails () {
    await OrderItemModel.destroy({ where: { subOrderId: this.id }, individualHooks: true });
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
