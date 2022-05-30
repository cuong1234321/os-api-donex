import settings from '@configs/settings';
import OrderEntity from '@entities/orders';
import OrderInterface from '@interfaces/orders';
import SubOrderInterface from '@interfaces/subOrders';
import VnpayPaymentService from '@services/vnpayPayment';
import dayjs from 'dayjs';
import { BelongsToGetAssociationMixin, HasManyGetAssociationsMixin, Model, ModelScopeOptions, Op, Transaction, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import AdminModel from './admins';
import CoinWalletChangeModel from './coinWalletChanges';
import MDistrictModel from './mDistricts';
import MProvinceModel from './mProvinces';
import MWardModel from './mWards';
import OrderItemModel from './orderItems';
import ProductVariantModel from './productVariants';
import SaleCampaignModel from './saleCampaigns';
import SubOrderModel from './subOrders';
import UserModel from './users';
import VoucherApplicationModel from './voucherApplications';
import VoucherModel from './vouchers';
import WarehouseModel from './warehouses';

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
  public promotionType: string;
  public shippingFullName: string;
  public shippingPhoneNumber: string;
  public shippingProvinceId: string;
  public shippingDistrictId: string;
  public shippingWardId: number;
  public shippingAddress: string;
  public transactionId: string;
  public rankDiscount: number;
  public saleCampaignId: number;
  public status: string;
  public paidAt?: Date;
  public portalConfirmAt?: Date;
  public applicationDiscount?: number;
  public transportUnit: string;
  public referralCode: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public subOrders?: SubOrderModel[];
  public province?: MProvinceModel;
  public district?: MDistrictModel;
  public ward?: MWardModel;

  static readonly USER_CREATABLE_PARAMETERS = ['paymentMethod', 'coinUsed', 'shippingFullName', 'shippingProvinceId',
    'shippingDistrictId', 'shippingPhoneNumber', 'shippingWardId', 'shippingAddress', 'appliedVoucherId', 'note', 'referralCode',
    {
      subOrders: [
        'warehouseId',
        { items: ['productVariantId', 'quantity'] },
      ],
    },
  ]

  static readonly ADMIN_CREATABLE_PARAMETERS = ['orderableType', 'appliedVoucherId', 'orderableId', 'saleChannel', 'shippingFullName', 'shippingProvinceId',
    'shippingDistrictId', 'shippingPhoneNumber', 'shippingWardId', 'shippingAddress', 'saleCampaignId',
    {
      subOrders: [
        'warehouseId', 'weight', 'length', 'width', 'height', 'pickUpAt', 'shippingFeeMisa', 'shippingFee', 'deposit', 'deliveryType', 'deliveryInfo', 'note', 'shippingType', 'shippingAttributeType',
        { items: ['productVariantId', 'quantity'] },
      ],
    }]

  static readonly ADMIN_UPDATABLE_PARAMETERS = ['orderableType', 'appliedVoucherId', 'orderableId', 'saleChannel', 'shippingFullName', 'shippingProvinceId',
    'shippingDistrictId', 'shippingPhoneNumber', 'shippingWardId', 'shippingAddress', 'saleCampaignId', 'status',
    {
      subOrders: [
        'id', 'warehouseId', 'weight', 'length', 'width', 'height', 'pickUpAt', 'shippingFeeMisa', 'shippingFee', 'deposit', 'deliveryType', 'deliveryInfo', 'note', 'shippingType', 'shippingAttributeType',
        { items: ['id', 'productVariantId', 'quantity'] },
      ],
    }]

  static readonly SELLER_CREATABLE_PARAMETERS = ['appliedVoucherId', 'saleChannel', 'shippingFullName', 'shippingProvinceId',
    'shippingDistrictId', 'shippingPhoneNumber', 'shippingWardId', 'shippingAddress', 'saleCampaignId', 'paymentMethod',
    {
      subOrders: [
        'warehouseId', 'weight', 'length', 'width', 'height', 'pickUpAt', 'shippingFeeMisa', 'shippingFee', 'deposit',
        'deliveryType', 'deliveryInfo', 'note', 'shippingType', 'shippingAttributeType',
        { items: ['productVariantId', 'quantity'] },
      ],
    },
  ]

  public static readonly ORDERABLE_TYPE = { USER: 'user', COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor' }
  public static readonly CREATABLE_TYPE = { USER: 'user', ADMIN: 'admin', COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor' }
  public static readonly PAYMENT_METHOD = { BANKING: 'banking', COD: 'COD', VN_PAY: 'vnPay', WALLET: 'wallet' }
  public static readonly PROMOTION_TYPE = { SYSTEM_RANK_PROMOTION: 'systemRankPromotion', USER_VOUCHER: 'userVoucher' }
  public static readonly SALE_CHANNEL = {
    FACEBOOK: 'facebook',
    LAZADA: 'lazada',
    SHOPEE: 'shopee',
    TIKI: 'tiki',
    WHOLESALE: 'wholesale',
    RETAIL: 'retail',
    OTHER: 'other',
  }

  public static readonly TRANSPORT_UNIT = {
    GHN: 'ghn',
    VTP: 'vtp',
  }

  public static readonly STATUS_ENUM = { DRAFT: 'draft', PENDING: 'pending', PAID: 'paid', COMPLETE: 'complete', CANCEL: 'cancel' }

  static readonly hooks: Partial<ModelHooks<OrderModel>> = {
    async beforeCreate (record: OrderModel) {
      record.code = await this.generateOderCode();
    },
    async afterDestroy (record) {
      record.deleteOrderDetails();
    },
    async afterCreate (record) {
      if (record.appliedVoucherId) {
        await VoucherModel.update({ discount: record.applicationDiscount, activeAt: dayjs() }, { where: { id: record.appliedVoucherId } });
      }
      await record.subtractUserCoin();
    },
  }

  static readonly validations: ModelValidateOptions = {
    async validateShippingWard () {
      const ward = await MWardModel.scope([
        { method: ['byId', this.shippingWardId] },
      ]).findOne();
      if (!ward) {
        throw new ValidationErrorItem('Địa chỉ không hợp lệ', 'validateShippingWard', 'shippingWardId', this.shippingWardId);
      }
    },
    async validateShippingDistrict () {
      const district = await MDistrictModel.scope([
        { method: ['byId', this.shippingDistrictId] },
      ]).findOne();
      if (!district) {
        throw new ValidationErrorItem('Địa chỉ không hợp lệ', 'validateShippingDistrict', 'shippingDistrictId', this.shippingDistrictId);
      }
    },
    async validateShippingProvince () {
      const province = await MProvinceModel.scope([
        { method: ['byId', this.shippingProvinceId] },
      ]).findOne();
      if (!province) {
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
          { method: ['byUserVoucher', this.appliedVoucherId, this.ownerId, this.orderableType] },
          { method: ['byVoucherApplication', this.paymentMethod] },
          'isNotUsed',
        ]).findOne();
        if (!voucher) {
          throw new ValidationErrorItem('Voucher áp dụng không hợp lệ', 'validateVoucher', 'appliedVocherId', this.appliedVoucherId);
        }
      }
    },
    async validateCoinUsed () {
      if (this.orderableType !== OrderModel.ORDERABLE_TYPE.USER) return;
      const user = await UserModel.findByPk(this.orderableId);
      if (this.coinUsed && user.coinReward < parseInt(this.coinUsed as string)) {
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

  public getWard: BelongsToGetAssociationMixin<MWardModel>
  public getDistrict: BelongsToGetAssociationMixin<MDistrictModel>
  public getProvince: BelongsToGetAssociationMixin<MProvinceModel>
  public getSubOrders: HasManyGetAssociationsMixin<SubOrderModel>

  static readonly scopes: ModelScopeOptions = {
    byCode (code) {
      return {
        where: { code },
      };
    },
    byOwnerId (ownerId) {
      return { where: { ownerId } };
    },
    byId (id) {
      return {
        where: { id },
      };
    },
    withShippingAddress () {
      return {
        attributes: {
          include: [
            [Sequelize.literal('(SELECT title FROM m_districts WHERE id = OrderModel.shippingDistrictId)'), 'districtName'],
            [Sequelize.literal('(SELECT title FROM m_wards WHERE id = OrderModel.shippingWardId)'), 'wardName'],
            [Sequelize.literal('(SELECT title FROM m_provinces WHERE id = OrderModel.shippingProvinceId)'), 'provinceName'],
          ],
        },
      };
    },
    withSubOrder () {
      return {
        include: [{
          model: SubOrderModel,
          as: 'subOrders',
          include: [
            {
              model: OrderItemModel,
              as: 'items',
            },
          ],
        }],
      };
    },
    withVoucher () {
      return {
        include: [
          {
            model: VoucherModel,
            as: 'voucher',
            include: [
              {
                model: VoucherApplicationModel,
                as: 'application',
              },
            ],
          },
        ],
      };
    },
    withOrderAbleName () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT' +
                '(CASE orders.orderableType ' +
                'WHEN "user" THEN (SELECT users.fullName from users WHERE users.id = orders.orderableId) ' +
                'WHEN "collaborator" THEN (SELECT collaborators.fullName from collaborators WHERE collaborators.id = orders.orderableId) ' +
                'WHEN "agency" THEN (SELECT collaborators.fullName from collaborators WHERE collaborators.id = orders.orderableId) ' +
                'WHEN "distributor" THEN (SELECT collaborators.fullName from collaborators WHERE collaborators.id = orders.orderableId) ' +
                'END) FROM orders WHERE orders.id = OrderModel.id)'),
              'orderAbleName',
            ],
          ],
        },
      };
    },
    withsaleCampaign () {
      return {
        include: [
          {
            model: SaleCampaignModel,
            as: 'saleCampaign',
          },
        ],
      };
    },
    withAddress () {
      return {
        include: [
          {
            model: MProvinceModel,
            as: 'province',
          },
          {
            model: MDistrictModel,
            as: 'district',
          },
          {
            model: MWardModel,
            as: 'ward',
          },
        ],
      };
    },
    byOrderAble (orderableId, orderableType) {
      return {
        where: { orderableId, orderableType },
      };
    },
  }

  public async reloadWithDetail () {
    await this.reload({
      include: [
        {
          model: SubOrderModel,
          as: 'subOrders',
          include: [
            {
              model: OrderItemModel,
              as: 'items',
            },
          ],
        },
      ],
    });
  }

  public async deleteOrderDetails () {
    await SubOrderModel.destroy({ where: { orderId: this.id }, individualHooks: true });
  }

  public async getSubOrderDetail () {
    const subOrders = await this.getSubOrders({
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
                    Sequelize.literal('(SELECT title FROM m_colors INNER JOIN product_options ON product_options.value = m_colors.id AND product_options.key = "color" AND product_options.deletedAt IS NULL ' +
                    'INNER JOIN product_variant_options ON product_variant_options.optionId = product_options.id AND product_variant_options.deletedAt IS NULL ' +
                    'WHERE product_variant_options.variantId = `items->variant`.id)'),
                    'colorTitle',
                  ],
                  [
                    Sequelize.literal('(SELECT code FROM m_sizes INNER JOIN product_options ON product_options.value = m_sizes.id AND product_options.key = "size" AND product_options.deletedAt IS NULL ' +
                    'INNER JOIN product_variant_options ON product_variant_options.optionId = product_options.id AND product_variant_options.deletedAt IS NULL ' +
                    'WHERE product_variant_options.variantId = `items->variant`.id)'),
                    'sizeTitle',
                  ],
                  [
                    Sequelize.literal('(SELECT name FROM products WHERE id = `items->variant`.productId)'),
                    'productName',
                  ],
                  [
                    Sequelize.literal('(SELECT source FROM product_media WHERE productId = `items->variant`.productId AND isThumbnail = true LIMIT 1)'),
                    'productMedia',
                  ],
                ],
              },
            },
          ],
        },
        {
          model: WarehouseModel,
          as: 'warehouse',
          attributes: {
            include: [
              [Sequelize.literal('(SELECT title FROM m_districts WHERE id = warehouse.districtId)'), 'districtName'],
              [Sequelize.literal('(SELECT title FROM m_wards WHERE id = warehouse.wardId)'), 'wardName'],
              [Sequelize.literal('(SELECT title FROM m_provinces WHERE id = warehouse.provinceId)'), 'provinceName'],
            ],
          },
        },
      ],
    });
    return subOrders;
  }

  public static async formatOrder (subOrders: any) {
    const { warehouses, productVariants } = await this.getOrderAttributes(subOrders);
    for (const subOrder of subOrders) {
      const warehouse = warehouses.find((warehouse: any) => warehouse.id === subOrder.warehouseId);
      subOrder.setDataValue('warehouse', warehouse);
      for (const item of subOrder.items) {
        const productVariant = productVariants.find((productVariant: any) => productVariant.id === item.productVariantId);
        const productVariantInfo = {
          id: productVariant.id,
          productId: productVariant.productId,
          name: productVariant.name,
          slug: productVariant.slug,
          skuCode: productVariant.skuCode,
          barCode: productVariant.barCode,
          colorTitle: productVariant.colorTitle,
          sizeTitle: productVariant.sizeTitle,
          product: {
            avatar: productVariant.product.getDataValue('thumbnail'),
            name: productVariant.product.name,
            slug: productVariant.product.slug,
            shortDescription: productVariant.product.shortDescription,
            skuCode: productVariant.product.skuCode,
            barCode: productVariant.product.barCode,
          },
        };
        item.setDataValue('productVariantInfo', productVariantInfo);
      }
    }
    return subOrders;
  }

  public static async formatViewOrder (subOrders: any) {
    const { warehouses, productVariants } = await this.getOrderAttributes(subOrders);
    for (const subOrder of subOrders) {
      const warehouse = warehouses.find((warehouse: any) => warehouse.id === subOrder.warehouseId);
      subOrder.code = '';
      subOrder.subTotal = 0;
      subOrder.shippingFee = 0;
      subOrder.shippingDiscount = 0;
      subOrder.total = 0;
      subOrder.shippingCode = 0;
      subOrder.status = SubOrderModel.STATUS_ENUM.DRAFT;
      subOrder.weight = 0;
      subOrder.length = 0;
      subOrder.width = 0;
      subOrder.height = 0;
      subOrder.shippingFeeMisa = 0;
      subOrder.deposit = 0;
      subOrder.note = '';
      subOrder.deliveryType = '';
      subOrder.deliveryInfo = '';
      subOrder.shippingType = '';
      subOrder.shippingAttributeType = '';
      subOrder.warehouse = warehouse;
      for (const item of subOrder.items) {
        const productVariant = productVariants.find((productVariant: any) => productVariant.id === item.productVariantId);
        const productVariantInfo = {
          id: productVariant.id,
          productId: productVariant.productId,
          name: productVariant.name,
          slug: productVariant.slug,
          skuCode: productVariant.skuCode,
          barCode: productVariant.barCode,
          colorTitle: productVariant.getDataValue('colorTitle'),
          sizeTitle: productVariant.getDataValue('sizeTitle'),
          product: {
            avatar: productVariant.product.avatar,
            name: productVariant.product.name,
            slug: productVariant.product.slug,
            shortDescription: productVariant.product.shortDescription,
            skuCode: productVariant.product.skuCode,
            barCode: productVariant.product.barCode,
          },
        };
        item.productVariantInfo = productVariantInfo;
      }
    }
    return subOrders;
  }

  public async updateSubOrders (subOrders: any[], transaction?: Transaction) {
    if (!subOrders) return;
    subOrders.forEach((record: any) => {
      record.orderId = this.id;
    });
    const resultSubOrders = await SubOrderModel.bulkCreate(subOrders, {
      updateOnDuplicate: SubOrderModel.UPDATABLE_ON_DUPLICATE_PARAMETERS as (keyof SubOrderInterface)[],
      individualHooks: true,
      transaction,
    });
    await SubOrderModel.destroy({
      where: { orderId: this.id, id: { [Op.notIn]: resultSubOrders.map((subOrder) => subOrder.id) } },
      individualHooks: true,
      transaction,
    });
    for (const [index, subOrder] of resultSubOrders.entries()) {
      await subOrder.updateItems(subOrders[index].items, transaction);
    }
  }

  public async validSignature (responseParams?: any) {
    let result: boolean = false;
    const params = JSON.parse(JSON.stringify(responseParams));
    result = await (new VnpayPaymentService(this.id, this.transactionId, this.total, VnpayPaymentService.TXN_REF_PREFIX.TOP_UP)).validSignature(params);
    return result;
  }

  private async subtractUserCoin () {
    if (!this.coinUsed) return;
    if (this.orderableType !== OrderModel.ORDERABLE_TYPE.USER) return;
    await CoinWalletChangeModel.create(
      { id: undefined, userId: this.orderableId, type: CoinWalletChangeModel.TYPE_ENUM.SUBTRACT, mutableType: CoinWalletChangeModel.MUTABLE_TYPE.ORDER, mutableId: this.id, amount: 0 - this.coinUsed },
    );
  }

  public async isPaid (responseParams?: any) {
    const params = JSON.parse(JSON.stringify(responseParams));
    const result = params.vnp_TransactionStatus === '00' &&
          (await (new VnpayPaymentService(this.id, this.transactionId, this.total, VnpayPaymentService.TXN_REF_PREFIX.TOP_UP)).validSignature(params));
    return result;
  }

  private static async getOrderAttributes (subOrders: any) {
    const warehouseIds = new Array(0);
    let productVariantIds = new Array(0);
    for (const subOrder of subOrders) {
      warehouseIds.push(subOrder.warehouseId);
      productVariantIds.push(subOrder.items.map((item: any) => item.productVariantId));
    }
    productVariantIds = [...new Set(productVariantIds.flat(Infinity))];
    const warehouses = await WarehouseModel.scope([
      { method: ['byId', warehouseIds.flat(Infinity)] },
      'withAddress',
    ]).findAll();
    const productVariants = await ProductVariantModel.scope([
      { method: ['byId', productVariantIds] },
      'withOptions',
      'withProduct',
    ]).findAll();
    return { warehouses, productVariants };
  }

  public static initialize (sequelize: Sequelize) {
    this.init(OrderEntity, {
      hooks: OrderModel.hooks,
      scopes: OrderModel.scopes,
      validate: OrderModel.validations,
      tableName: 'orders',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
    this.hasMany(SubOrderModel, { as: 'subOrders', foreignKey: 'orderId' });
    this.belongsTo(MWardModel, { as: 'ward', foreignKey: 'shippingWardId' });
    this.belongsTo(MProvinceModel, { as: 'province', foreignKey: 'shippingProvinceId' });
    this.belongsTo(MDistrictModel, { as: 'district', foreignKey: 'shippingDistrictId' });
    this.belongsTo(UserModel, { as: 'ownerUser', foreignKey: 'ownerId' });
    this.belongsTo(UserModel, { as: 'orderableUser', foreignKey: 'orderableId' });
    this.belongsTo(UserModel, { as: 'creatableUser', foreignKey: 'creatableId' });
    this.belongsTo(AdminModel, { as: 'creatableAdmin', foreignKey: 'creatableId' });
    this.belongsTo(VoucherModel, { as: 'voucher', foreignKey: 'appliedVoucherId' });
    this.belongsTo(SaleCampaignModel, { as: 'saleCampaign', foreignKey: 'saleCampaignId' });
  }
}

export default OrderModel;
