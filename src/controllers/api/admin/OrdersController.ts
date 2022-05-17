import settings from '@configs/settings';
import ApplySaleCampaignVariantDecorator from '@decorators/applySaleCampaignVariants';
import sequelize from '@initializers/sequelize';
import { NoData, notEnoughCondition, orderProcessing } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import BillTemplateModel from '@models/billTemplates';
import CollaboratorModel from '@models/collaborators';
import OrderItemModel from '@models/orderItems';
import OrderModel from '@models/orders';
import RankModel from '@models/ranks';
import SellerLevelModel from '@models/sellerLevels';
import SubOrderModel from '@models/subOrders';
import UserModel from '@models/users';
import XlsxService from '@services/xlsx';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import Auth from '@repositories/models/auth';
import ShippingPartner from '@repositories/models/shippingPartners';
import SlugGeneration from '@libs/slugGeneration';
import VoucherConditionModel from '@models/voucherConditions';

class OrderController {
  public async show (req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const order = await OrderModel.scope([
        { method: ['byId', orderId] },
        'withShippingAddress',
        'withVoucher',
        'withOrderAbleName',
        'withsaleCampaign',
      ]).findOne();
      if (!order) { return sendError(res, 404, NoData); }
      order.setDataValue('subOrders', await order.getSubOrderDetail());
      sendSuccess(res, order);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const currentAdmin = req.currentAdmin || { id: 1 };
      let params = req.parameters.permit(OrderModel.ADMIN_CREATABLE_PARAMETERS).value();
      params.ownerId = currentAdmin.id;
      let total = 0;
      let subTotal = 0;
      let shippingFee = 0;
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
      for (const subOrder of params.subOrders) {
        const { items, totalPrice, totalQuantity } = await ApplySaleCampaignVariantDecorator.calculatorVariantPrice(subOrder.items, params.saleCampaignId);
        subOrder.items = items;
        subOrder.status = SubOrderModel.STATUS_ENUM.DRAFT;
        subOrder.subTotal = totalPrice;
        subOrder.total = totalQuantity;
        subOrder.billId = billTemplate.id;
        subTotal += totalPrice;
        total += totalQuantity;
        shippingFee += subOrder.shippingFee;
      }
      params = await this.applyRankDiscount(params, total, subTotal);
      params = await this.applyVoucher(params, subTotal, res);
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const order = await OrderModel.create({
          ...params,
          creatableType: OrderModel.CREATABLE_TYPE.ADMIN,
          creatableId: currentAdmin.id,
          ownerId: currentAdmin.id,
          total,
          subTotal,
          shippingFee,
          paymentMethod: OrderModel.PAYMENT_METHOD.COD,
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

  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.size as string || settings.defaultPerPage);
      const offset = (page - 1) * limit;
      const scopes = await this.listProductQueryBuilder(req);
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

  public async update (req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const order = await OrderModel.findByPk(orderId);
      if (!order) { return sendError(res, 404, NoData); }
      const subOrderNotDraft = await SubOrderModel.scope([
        { method: ['byOrderId', orderId] },
        'isNotDraft',
      ]).findOne();
      if (subOrderNotDraft) { return sendError(res, 404, orderProcessing); }
      let params = req.parameters.permit(OrderModel.ADMIN_UPDATABLE_PARAMETERS).value();
      let total = 0;
      let subTotal = 0;
      let shippingFee = 0;
      for (const subOrder of params.subOrders) {
        const { items, totalPrice, totalQuantity } = await ApplySaleCampaignVariantDecorator.calculatorVariantPrice(subOrder.items, params.saleCampaignId);
        subOrder.items = items;
        subOrder.status = SubOrderModel.STATUS_ENUM.DRAFT;
        subOrder.subTotal = totalPrice;
        subOrder.total = totalQuantity;
        subTotal += totalPrice;
        total += totalQuantity;
        shippingFee += subOrder.shippingFee;
      }
      params = await this.applyRankDiscount(params, total, subTotal);
      params = await this.applyVoucher(params, subTotal, res);
      await sequelize.transaction(async (transaction: Transaction) => {
        await order.update({
          ...params,
          total,
          subTotal,
          shippingFee,
        }, { transaction });
        await order.updateSubOrders(params.subOrders, transaction);
      });
      await order.reloadWithDetail();
      sendSuccess(res, order);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const order = await OrderModel.findByPk(orderId);
      if (!order) { return sendError(res, 404, NoData); }
      const subOrderNotDraft = await SubOrderModel.scope([
        { method: ['byOrderId', orderId] },
        'isNotDraft',
      ]).findOne();
      if (subOrderNotDraft) { return sendError(res, 404, orderProcessing); }
      await order.destroy();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async download (req: Request, res: Response) {
    try {
      const time = dayjs().format('DD-MM-YY-hh:mm:ss');
      const fileName = `Bao-cao-danh-sach-don-hang-${time}.xlsx`;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        'withOrders',
        { method: ['bySortOrder', sortBy, sortOrder] },
      ];
      const subOrders = await SubOrderModel.scope(scopes).findAll();
      const buffer: any = await XlsxService.downloadListOrders(subOrders);
      res.writeHead(200, [
        ['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        ['Content-Disposition', 'attachment; filename=' + `${fileName}`],
      ]);
      res.end(Buffer.from(buffer, 'base64'));
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
      const auth = await Auth.login();
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

  private async applyRankDiscount (order: any, totalQuantity: number, totalPrice: number) {
    if (order.orderableType === OrderModel.ORDERABLE_TYPE.USER) {
      const user = await UserModel.findByPk(order.orderableId, { paranoid: false });
      const basicRank = (await RankModel.findOrCreate({
        where: {
          type: RankModel.TYPE_ENUM.BASIC,
        },
        defaults: { id: undefined, type: RankModel.TYPE_ENUM.BASIC },
      }))[0];
      const basicConditions = await basicRank.getConditions();
      if (user.getDataValue('rank') === UserModel.RANK_ENUM.BASIC) {
        order = this.applyBasicRankUser(order, totalQuantity, totalPrice, basicConditions);
      } else if (user.getDataValue('rank') === UserModel.RANK_ENUM.VIP) {
        order = await this.applyVipRankUser(order, totalQuantity, totalPrice, basicConditions);
      }
    } else {
      const seller = await CollaboratorModel.findByPk(order.orderableId, { paranoid: false });
      const levelId = seller.defaultRank || seller.currentRank;
      if (!levelId) return order;
      const sellerLevel = await SellerLevelModel.findByPk(levelId);
      const rankDiscount = totalPrice * sellerLevel.discountValue / 100;
      order.rankDiscount = rankDiscount;
      order.subOrders.forEach((subOrder: any) => {
        subOrder.rankDiscount = subOrder.subTotal / totalPrice * rankDiscount;
      });
    }
    return order;
  }

  private applyBasicRankUser (order: any, totalQuantity: number, totalPrice: number, basicConditions: any) {
    if (basicConditions.length === 0) return order;
    const basicRankCondition = basicConditions.find((record: any) => record.orderAmountFrom < totalQuantity && (record.orderAmountTo || 999999999) > totalQuantity);
    if (!basicRankCondition) return order;
    const rankDiscount = totalPrice * basicRankCondition.discountValue / 100;
    order.rankDiscount = rankDiscount;
    order.subOrders.forEach((subOrder: any) => {
      subOrder.rankDiscount = subOrder.subTotal / totalPrice * rankDiscount;
    });
    return order;
  }

  private async applyVipRankUser (order: any, totalQuantity: number, totalPrice: number, basicConditions: any) {
    const vipRank = (await RankModel.findOrCreate({
      where: {
        type: RankModel.TYPE_ENUM.VIP,
      },
      defaults: { id: undefined, type: RankModel.TYPE_ENUM.VIP },
    }))[0];
    if (vipRank.dateEarnDiscount.includes(dayjs().format('DD'))) {
      const vipConditions = await vipRank.getConditions();
      if (vipConditions.length === 0) return order;
      const vipRankCondition = vipConditions.find((record: any) => record.orderAmountFrom < totalQuantity && (record.orderAmountTo || 9999999) > totalQuantity);
      if (!vipRankCondition) return order;
      const rankDiscount = totalPrice * vipRankCondition.discountValue / 100;
      order.rankDiscount = rankDiscount;
      order.subOrders.forEach((subOrder: any) => {
        subOrder.rankDiscount = subOrder.subTotal / totalPrice * rankDiscount;
      });
    } else {
      order = this.applyBasicRankUser(order, totalQuantity, totalPrice, basicConditions);
    }
    return order;
  }

  private async applyVoucher (order: any, totalPrice: number, res: any) {
    const conditions = await VoucherConditionModel.scope([
      { method: ['byVoucherApplication', order.appliedVoucherId] },
      { method: ['bySorting', 'orderValue', 'DESC'] },
    ]).findAll();
    const conditionRefs = conditions.filter((record: any) => record.orderValue <= totalPrice);
    if (conditionRefs.length === 0) {
      return sendError(res, 404, notEnoughCondition);
    };
    const condition = conditionRefs[0];
    if (condition.discountType === VoucherConditionModel.DISCOUNT_TYPE_ENUM.CASH) {
      const discount = condition.discountValue;
      (order.subOrders).forEach((subOrder: any) => {
        subOrder.voucherDiscount = subOrder.subTotal / totalPrice * discount;
      });
    } else if (condition.discountType === VoucherConditionModel.DISCOUNT_TYPE_ENUM.PERCENT) {
      const discount = totalPrice * condition.discountValue / 100;
      (order.subOrders).forEach((subOrder: any) => {
        subOrder.voucherDiscount = subOrder.subTotal / totalPrice * discount;
      });
    }
    return order;
  }
}

export default new OrderController();
