import settings from '@configs/settings';
import sequelize from '@initializers/sequelize';
import { NoData, notEnoughMoney, voucherIsCannotApply } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import SlugGeneration from '@libs/slugGeneration';
import BillTemplateModel from '@models/billTemplates';
import CollaboratorModel from '@models/collaborators';
import MoneyWalletChangeModel from '@models/moneyWalletChanges';
import OrderItemModel from '@models/orderItems';
import OrderModel from '@models/orders';
import ProductVariantModel from '@models/productVariants';
import SellerLevelModel from '@models/sellerLevels';
import SubOrderModel from '@models/subOrders';
import VoucherConditionModel from '@models/voucherConditions';
import VoucherModel from '@models/vouchers';
import Auth from '@repositories/models/auth';
import ShippingPartner from '@repositories/models/shippingPartners';
import SendNotification from '@services/notification';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';

class OrderController {
  public async create (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      let params = req.parameters.permit(OrderModel.SELLER_CREATABLE_PARAMETERS).value();
      let total = 0;
      let subTotal = 0;
      let shippingFee = 0;
      let totalDiscount = 0;
      const billTemplate = (await BillTemplateModel.findOrCreate({
        where: {
          status: BillTemplateModel.STATUS_ENUM.ACTIVE,
        },
        defaults: {
          id: undefined,
          title: 'Hóa đơn thanh toán',
          content: '',
          status: BillTemplateModel.STATUS_ENUM.ACTIVE,
        },
      }))[0];
      const variants = await ProductVariantModel.scope(['withProduct']).findAll();
      for (const subOrder of params.subOrders) {
        const { items, totalPrice, totalQuantity, totalWeight } = await this.calculatorVariantPrice(subOrder.items, variants);
        subOrder.items = items;
        subOrder.status = SubOrderModel.STATUS_ENUM.PENDING;
        subOrder.subTotal = totalPrice;
        subOrder.total = totalQuantity;
        subOrder.billId = billTemplate.id;
        subOrder.weight = totalWeight;
        subTotal += totalPrice;
        total += totalQuantity;
        shippingFee += subOrder.shippingFee;
        totalDiscount = totalDiscount + (subOrder.deposit || 0) + (subOrder.totalOtherDiscount || 0);
      }
      params.orderableType = currentSeller.type;
      params.orderableId = currentSeller.id;
      params.creatableType = currentSeller.type;
      params.creatableId = currentSeller.id;
      params = await this.applyRankDiscount(params, subTotal);
      if (params.appliedVoucherId) {
        const order = await this.applyVoucher(params, subTotal);
        if (!order) { return sendError(res, 404, voucherIsCannotApply); }
        params = order;
      }
      totalDiscount = totalDiscount + params.rankDiscount + (params?.voucherDiscount || 0);
      const finalAmount = subTotal + shippingFee - totalDiscount;
      if (params.paymentMethod === OrderModel.PAYMENT_METHOD.WALLET) {
        if (currentSeller.accumulatedMoney < finalAmount) {
          return sendError(res, 403, notEnoughMoney);
        }
      }
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const order = await OrderModel.create({
          ...params,
          ownerId: currentSeller.id,
          total,
          subTotal,
          shippingFee,
        }, {
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
              transaction,
            },
          ],
          transaction,
        });
        return order;
      });
      sendSuccess(res, { order: result });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  private async calculatorVariantPrice (items: OrderItemModel[], variants: ProductVariantModel[]) {
    let totalPrice = 0;
    let totalQuantity = 0;
    let totalWeight = 0;
    items.forEach((item: any) => {
      const variant = variants.find((record: any) => record.id === item.productVariantId);
      item.listedPrice = variant.sellPrice;
      totalPrice += item.sellingPrice * item.quantity;
      totalQuantity += item.quantity;
      item.saleCampaignDiscount = item.listedPrice - item.sellingPrice;
      totalWeight += item.quantity * ((JSON.parse(JSON.stringify(variant))).product.weight);
    });
    return { items, totalPrice, totalQuantity, totalWeight };
  }

  public async index (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.size as string || settings.defaultPerPage);
      const offset = (page - 1) * limit;
      const scopes = await this.listProductQueryBuilder(req);
      scopes.push({ method: ['byOrderAble', currentSeller.id, currentSeller.type] });
      const { rows, count } = await SubOrderModel.scope(scopes).findAndCountAll({
        offset,
        limit,
        distinct: true,
        col: 'SubOrderModel.id',
      });
      sendSuccess(res, { subOrders: rows, pagination: { total: count, page, perpage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async indexAffiliate (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.size as string || settings.defaultPerPage);
      const offset = (page - 1) * limit;
      const scopes = await this.listProductQueryBuilder(req);
      scopes.push({ method: ['byReferralCode', currentSeller.referralCode] });
      const { rows, count } = await SubOrderModel.scope(scopes).findAndCountAll({
        offset,
        limit,
        distinct: true,
        col: 'SubOrderModel.id',
      });
      sendSuccess(res, { subOrders: rows, pagination: { total: count, page, perpage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      const { orderId, subOrderId } = req.params;
      const subOrder = await SubOrderModel.scope([
        { method: ['byId', subOrderId] },
        { method: ['byOrderId', orderId] },
        'withItemDetail',
        'withWarehouseDetail',
        'withFinalAmount',
      ]).findOne();
      if (!subOrder) { return sendError(res, 404, NoData); }
      const order = await OrderModel.scope([
        { method: ['byId', orderId] },
        'withShippingAddress',
        'withOrderAbleName',
        { method: ['byOrderAble', currentSeller.id, currentSeller.type] },
      ]).findOne();
      if (!order) { return sendError(res, 404, NoData); }
      sendSuccess(res, { order, subOrder, currentSeller });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async calculatorVoucher (req: Request, res: Response) {
    try {
      const { currentSeller } = req;
      const params = req.body;
      params.orderableId = currentSeller.id;
      params.orderableType = currentSeller.type;
      const order = await this.applyVoucher(params, params.totalPrice);
      if (!order) { return sendError(res, 404, voucherIsCannotApply); }
      sendSuccess(res, { order });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async calculatorRankDiscount (req: Request, res: Response) {
    try {
      const { currentSeller } = req;
      let params = req.body;
      params.orderableId = currentSeller.id;
      params.orderableType = currentSeller.type;
      params = await this.applyRankDiscount(params, params.totalPrice);
      sendSuccess(res, { order: params });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async confirmAdminOrderStatus (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      const { orderId, subOrderId } = req.params;
      const order = await OrderModel.scope([
        { method: ['byId', orderId] },
        { method: ['byOrderAble', currentSeller.id, currentSeller.type] },
      ]).findOne();
      const subOrder = await SubOrderModel.scope([
        { method: ['byId', subOrderId] },
        { method: ['byAdminOrderStatus', SubOrderModel.ADMIN_ORDER_STATUS.PENDING] },
        'withFinalAmount',
      ]).findOne();
      if (!order || !subOrder) {
        return sendError(res, 404, NoData);
      }
      if (order.paymentMethod === OrderModel.PAYMENT_METHOD.WALLET && currentSeller.accumulatedMoney < (await subOrder).getDataValue('finalAmount')) {
        return sendError(res, 403, notEnoughMoney);
      }
      await sequelize.transaction(async (transaction: Transaction) => {
        await subOrder.update({
          paymentStatus: SubOrderModel.PAYMENT_STATUS.PAID,
          status: SubOrderModel.STATUS_ENUM.PENDING,
          adminOrderStatus: SubOrderModel.ADMIN_ORDER_STATUS.CONFIRM,
        }, {
          transaction,
          hooks: true,
          validate: false,
        });
        const moneyWalletChange: any = {
          ownerId: currentSeller.id,
          type: MoneyWalletChangeModel.TYPE_ENUM.SUBTRACT,
          mutableType: MoneyWalletChangeModel.MUTABLE_TYPE.ADMIN_ORDER,
          mutableId: subOrder.id,
          amount: 0 - subOrder.getDataValue('finalAmount'),
        };
        await MoneyWalletChangeModel.create(moneyWalletChange, { transaction });
      });
      SendNotification.confirmAdminOrderToSeller(order.creatableId, subOrder.code);
      sendSuccess(res, { subOrder });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  private async listProductQueryBuilder (req: any) {
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'DESC';
    const {
      code, paymentStatus, createAbleName, status, saleChannel, shippingName,
      subTotal, finalAmount, pickUpAt, phoneNumber, createdAt, shippingFee, shippingType, shippingCode, orderPartnerCode, paymentMethod, shippingFeeMisa,
    } = req.query;
    const scopes: any = [
      'withOrders',
      { method: ['bySortOrder', sortBy, sortOrder] },
      'withFinalAmount',
    ];
    if (code) scopes.push({ method: ['byCode', code] });
    if (paymentStatus) scopes.push({ method: ['byPaymentStatus', paymentStatus] });
    if (status) scopes.push({ method: ['byStatus', status] });
    if (saleChannel) scopes.push({ method: ['bySaleChannel', saleChannel] });
    if (createAbleName) scopes.push({ method: ['byCreateAdminName', createAbleName] });
    if (shippingName) scopes.push({ method: ['byShippingName', shippingName] });
    if (pickUpAt) scopes.push({ method: ['byPickUpAt', pickUpAt] });
    if (phoneNumber) scopes.push({ method: ['byPhoneNumber', phoneNumber] });
    if (createdAt) scopes.push({ method: ['byCreatedAt', createdAt] });
    if (shippingType) {
      const auth = await Auth.misaLogin();
      const shippingPartners = await ShippingPartner.index(auth);
      const ShippingPartnerFilters = shippingPartners.filter((record: any) => SlugGeneration.execute(record.PartnerName).includes(SlugGeneration.execute(shippingType)));
      scopes.push({ method: ['byShippingType', ShippingPartnerFilters.map((record: any) => record.Partner)] });
    }
    if (shippingCode) scopes.push({ method: ['byShippingCode', shippingCode] });
    if (orderPartnerCode) scopes.push({ method: ['byOrderPartnerCode', orderPartnerCode] });
    if (paymentMethod) scopes.push({ method: ['byPaymentMethod', paymentMethod] });
    if (subTotal) {
      const value = parseInt((subTotal as string).split(',')[0]);
      const operator = (subTotal as string).split(',')[1];
      if (operator === 'eq') scopes.push({ method: ['bySubTotalEq', value] });
      if (operator === 'lte') scopes.push({ method: ['bySubTotalLte', value] });
      if (operator === 'gte') scopes.push({ method: ['bySubTotalGte', value] });
    }
    if (shippingFee) {
      const value = parseInt((shippingFee as string).split(',')[0]);
      const operator = (shippingFee as string).split(',')[1];
      if (operator === 'eq') scopes.push({ method: ['byShippingFeeEq', value] });
      if (operator === 'lte') scopes.push({ method: ['byShippingFeeLte', value] });
      if (operator === 'gte') scopes.push({ method: ['byShippingFeeGte', value] });
    }
    if (shippingFeeMisa) {
      const value = parseInt((shippingFeeMisa as string).split(',')[0]);
      const operator = (shippingFeeMisa as string).split(',')[1];
      if (operator === 'eq') scopes.push({ method: ['byShippingFeeMisaEq', value] });
      if (operator === 'lte') scopes.push({ method: ['byShippingFeeMisaLte', value] });
      if (operator === 'gte') scopes.push({ method: ['byShippingFeeMisaGte', value] });
    }
    if (finalAmount) {
      const value = parseInt((finalAmount as string).split(',')[0]);
      const operator = (finalAmount as string).split(',')[1];
      if (operator === 'eq') scopes.push({ method: ['byFinalAmountEq', value] });
      if (operator === 'lte') scopes.push({ method: ['byFinalAmountLte', value] });
      if (operator === 'gte') scopes.push({ method: ['byFinalAmountGte', value] });
    }
    return scopes;
  }

  private async applyRankDiscount (order: any, totalPrice: number) {
    order.rankDiscount = 0;
    const seller = await CollaboratorModel.findByPk(order.orderableId, { paranoid: false });
    const levelId = seller.defaultRank || seller.currentRank;
    if (!levelId) return order;
    const sellerLevel = await SellerLevelModel.findByPk(levelId);
    const rankDiscount = totalPrice * sellerLevel.discountValue / 100;
    order.rankDiscount = rankDiscount;
    if (order.subOrders) {
      order.subOrders.forEach((subOrder: any) => {
        subOrder.rankDiscount = subOrder.subTotal / totalPrice * rankDiscount;
      });
    }
    return order;
  }

  private async applyVoucher (order: any, totalPrice: number) {
    const voucher = await VoucherModel.scope([
      { method: ['byUserVoucher', order.appliedVoucherId, order.orderableId, order.orderableType] },
      { method: ['byVoucherApplication', order.paymentMethod] },
      'isNotUsed',
    ]).findOne();
    if (!voucher) {
      return false;
    }
    const conditions = await VoucherConditionModel.scope([
      { method: ['byVoucherApplication', voucher.voucherApplicationId] },
      { method: ['bySorting', 'orderValue', 'DESC'] },
    ]).findAll();
    const conditionRefs = conditions.filter((record: any) => record.orderValue <= totalPrice);
    if (conditionRefs.length === 0) {
      return false;
    };
    const condition = conditionRefs[0];
    order.voucherDiscount = 0;
    if (condition.discountType === VoucherConditionModel.DISCOUNT_TYPE_ENUM.CASH) {
      const discount = condition.discountValue;
      order.voucherDiscount = discount;
      if (order.subOrders) {
        (order.subOrders).forEach((subOrder: any) => {
          subOrder.voucherDiscount = subOrder.subTotal / totalPrice * discount;
        });
      }
    } else if (condition.discountType === VoucherConditionModel.DISCOUNT_TYPE_ENUM.PERCENT) {
      const discount = totalPrice * condition.discountValue / 100;
      order.voucherDiscount = discount;
      if (order.subOrders) {
        (order.subOrders).forEach((subOrder: any) => {
          subOrder.voucherDiscount = subOrder.subTotal / totalPrice * discount;
        });
      }
    }
    return order;
  }
}

export default new OrderController();
