import settings from '@configs/settings';
import ApplySaleCampaignVariantDecorator from '@decorators/applySaleCampaignVariants';
import sequelize from '@initializers/sequelize';
import { invalidParameter, MissingImportFile, NoData, notEnoughMoney, orderProcessing, voucherIsCannotApply } from '@libs/errors';
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
import VoucherModel from '@models/vouchers';
import _ from 'lodash';
import OrderImporterService from '@services/orderImporter';
import SendNotification from '@services/notification';

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
        'withTotalCoinDiscount',
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
          title: 'H??a ????n thanh to??n',
          content: '',
          status: BillTemplateModel.STATUS_ENUM.ACTIVE,
        },
      }))[0];
      for (const subOrder of params.subOrders) {
        const { items, totalPrice, totalQuantity, totalWeight } = await ApplySaleCampaignVariantDecorator.calculatorVariantPrice(subOrder.items, params.saleCampaignId);
        subOrder.items = items;
        subOrder.status = SubOrderModel.STATUS_ENUM.DRAFT;
        subOrder.subTotal = totalPrice;
        subOrder.total = totalQuantity;
        subOrder.billId = billTemplate.id;
        subOrder.weight = totalWeight;
        subOrder.tax = settings.defaultTax * totalPrice / 100;
        subOrder.adminConfirmId = currentAdmin.id;
        subTotal += totalPrice;
        total += totalQuantity;
        shippingFee += subOrder.shippingFee;
        subOrder.totalOtherDiscount = _.sumBy(subOrder.otherDiscounts, (record: any) => record.value);
        totalDiscount = totalDiscount + (subOrder.deposit || 0) + (subOrder.totalOtherDiscount || 0);
        if (params.orderableType === OrderModel.ORDERABLE_TYPE.USER) {
          params.paymentMethod = OrderModel.PAYMENT_METHOD.COD;
          subOrder.adminOrderStatus = SubOrderModel.ADMIN_ORDER_STATUS.CONFIRM;
        }
      }
      params = await this.applyRankDiscount(params, total, subTotal);
      if (params.appliedVoucherId) {
        const order = await this.applyVoucher(params, subTotal);
        if (!order) { return sendError(res, 404, voucherIsCannotApply); }
        params = order;
      }
      totalDiscount = totalDiscount + params.rankDiscount + (params?.voucherDiscount || 0);
      const finalAmount = subTotal + shippingFee - totalDiscount;
      if (params.orderableType !== OrderModel.ORDERABLE_TYPE.USER && params.paymentMethod === OrderModel.PAYMENT_METHOD.WALLET) {
        const seller = await CollaboratorModel.findByPk(params.orderableId);
        if (seller.accumulatedMoney < finalAmount) {
          return sendError(res, 403, notEnoughMoney);
        }
      }
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const order = await OrderModel.create({
          ...params,
          creatableType: OrderModel.CREATABLE_TYPE.ADMIN,
          creatableId: currentAdmin.id,
          ownerId: params.orderableId,
          total,
          subTotal,
          shippingFee,
          finalAmount,
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
      if (params.orderableType !== OrderModel.ORDERABLE_TYPE.USER) {
        SendNotification.adminOrderToSeller(params.orderableId, params.orderableType);
      }
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
      let totalDiscount = 0;
      for (const subOrder of params.subOrders) {
        const { items, totalPrice, totalQuantity, totalWeight } = await ApplySaleCampaignVariantDecorator.calculatorVariantPrice(subOrder.items, params.saleCampaignId);
        subOrder.items = items;
        subOrder.status = SubOrderModel.STATUS_ENUM.DRAFT;
        subOrder.subTotal = totalPrice;
        subOrder.total = totalQuantity;
        subOrder.weight = totalWeight;
        subOrder.tax = settings.defaultTax * totalPrice / 100;
        subTotal += totalPrice;
        total += totalQuantity;
        shippingFee += subOrder.shippingFee;
        totalDiscount = totalDiscount + (subOrder.deposit || 0) + (subOrder.totalOtherDiscount || 0);
        if (params.orderableType === OrderModel.ORDERABLE_TYPE.USER) {
          params.paymentMethod = OrderModel.PAYMENT_METHOD.COD;
          subOrder.adminOrderStatus = SubOrderModel.ADMIN_ORDER_STATUS.CONFIRM;
        }
      }
      params = await this.applyRankDiscount(params, total, subTotal);
      if (params.appliedVoucherId) {
        const order = await this.applyVoucher(params, subTotal);
        if (!order) { return sendError(res, 404, voucherIsCannotApply); }
        params = order;
      }
      totalDiscount = totalDiscount + params.rankDiscount + (params?.voucherDiscount || 0);
      const finalAmount = subTotal + shippingFee - totalDiscount;
      if (params.orderableType !== OrderModel.ORDERABLE_TYPE.USER && params.paymentMethod === OrderModel.PAYMENT_METHOD.WALLET) {
        const seller = await CollaboratorModel.findByPk(params.orderableId);
        if (seller.accumulatedMoney < finalAmount) {
          return sendError(res, 403, notEnoughMoney);
        }
      }
      await sequelize.transaction(async (transaction: Transaction) => {
        await order.update({
          ...params,
          ownerId: params.orderableId,
          total,
          subTotal,
          shippingFee,
          finalAmount,
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
      const { subOrderIds } = req.query;
      const time = dayjs().format('DD-MM-YY-hh:mm:ss');
      const fileName = `Bao-cao-danh-sach-don-hang-${time}.xlsx`;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        'withOrders',
        'withFinalAmount',
        { method: ['bySortOrder', sortBy, sortOrder] },
      ];
      if (subOrderIds) scopes.push({ method: ['byId', (subOrderIds as string).split(',')] });
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

  public async calculatorVoucher (req: Request, res: Response) {
    try {
      const params = req.body;
      const order = await this.applyVoucher(params, params.totalPrice);
      if (!order) { return sendError(res, 404, voucherIsCannotApply); }
      sendSuccess(res, { order });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async calculatorRankDiscount (req: Request, res: Response) {
    try {
      let params = req.body;
      params = await this.applyRankDiscount(params, params.totalQuantity, params.totalPrice);
      sendSuccess(res, { order: params });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadOrder (req: Request, res: Response) {
    try {
      const file = req.file;
      if (file.originalname.split('.').reverse()[0] !== 'xlsx') {
        sendError(res, 400, MissingImportFile);
      }
      const adminImporter = new OrderImporterService(file);
      const subOrder = await adminImporter.executeImport();
      if (subOrder === false) { return sendError(res, 403, invalidParameter); }
      sendSuccess(res, subOrder);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async downloadTemplate (req: Request, res: Response) {
    try {
      const file = 'public/Nhap-don-hang.xlsx';
      res.download(file, 'Form t???i l??n nh???p ????n h??ng (M???u).xlsx');
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  private async listProductQueryBuilder (req: any) {
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'DESC';
    const { currentAdmin } = req;
    const adminWarehouses = await currentAdmin.getAdminWarehouses();
    const {
      code, paymentStatus, createAbleName, status, saleChannel, shippingName,
      subTotal, finalAmount, pickUpAt, phoneNumber, createdAt, shippingFee, shippingType, shippingCode, orderPartnerCode, paymentMethod, shippingFeeMisa,
      orderCode, affiliateStatus,
    } = req.query;
    const scopes: any = [
      'withOrders',
      'withFinalAmount',
      'withWarehouseExportId',
      { method: ['bySortOrder', sortBy, sortOrder] },
    ];
    if (currentAdmin.roleId !== 0) scopes.push({ method: ['byWarehouse', adminWarehouses.map((record: any) => record.warehouseId)] });
    if (code) scopes.push({ method: ['byCode', code] });
    if (paymentStatus) scopes.push({ method: ['byPaymentStatus', paymentStatus] });
    if (status) scopes.push({ method: ['byStatus', status] });
    if (saleChannel) scopes.push({ method: ['bySaleChannel', saleChannel] });
    if (createAbleName) scopes.push({ method: ['byCreateAdminName', createAbleName] });
    if (shippingName) scopes.push({ method: ['byShippingName', shippingName] });
    if (pickUpAt) scopes.push({ method: ['byPickUpAt', pickUpAt] });
    if (phoneNumber) scopes.push({ method: ['byPhoneNumber', phoneNumber] });
    if (createdAt) scopes.push({ method: ['byCreatedAt', createdAt] });
    if (affiliateStatus) scopes.push({ method: ['byAffiliateStatus', affiliateStatus] });
    if (orderCode) scopes.push({ method: ['byOrderCode', orderCode] });
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

  private async applyRankDiscount (order: any, totalQuantity: number, totalPrice: number) {
    order.rankDiscount = 0;
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
      if (order.subOrders) {
        order.subOrders.forEach((subOrder: any) => {
          subOrder.rankDiscount = subOrder.subTotal / totalPrice * rankDiscount;
        });
      }
    }
    return order;
  }

  private applyBasicRankUser (order: any, totalQuantity: number, totalPrice: number, basicConditions: any) {
    if (basicConditions.length === 0) return order;
    const basicRankCondition = basicConditions.find((record: any) => record.orderAmountFrom <= totalQuantity && (record.orderAmountTo || 999999999) >= totalQuantity);
    if (!basicRankCondition) return order;
    const rankDiscount = totalPrice * basicRankCondition.discountValue / 100;
    order.rankDiscount = rankDiscount;
    if (order.subOrders) {
      order.subOrders.forEach((subOrder: any) => {
        subOrder.rankDiscount = subOrder.subTotal / totalPrice * rankDiscount;
      });
    }
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
      const vipRankCondition = vipConditions.find((record: any) => record.orderAmountFrom <= totalQuantity && (record.orderAmountTo || 9999999) >= totalQuantity);
      if (!vipRankCondition) return order;
      const rankDiscount = totalPrice * vipRankCondition.discountValue / 100;
      order.rankDiscount = rankDiscount;
      if (order.subOrders) {
        order.subOrders.forEach((subOrder: any) => {
          subOrder.rankDiscount = subOrder.subTotal / totalPrice * rankDiscount;
        });
      }
    } else {
      order = this.applyBasicRankUser(order, totalQuantity, totalPrice, basicConditions);
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
      const discount = condition.discountValue > totalPrice ? totalPrice : condition.discountValue;
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
