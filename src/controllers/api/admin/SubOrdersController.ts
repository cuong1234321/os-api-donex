import sequelize from '@initializers/sequelize';
import { MissingImportFile, NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import BillTemplateModel from '@models/billTemplates';
import CollaboratorModel from '@models/collaborators';
import MoneyWalletChangeModel from '@models/moneyWalletChanges';
import OrderItemModel from '@models/orderItems';
import OrderModel from '@models/orders';
import SubOrderModel from '@models/subOrders';
import SendNotification from '@services/notification';
import XlsxService from '@services/xlsx';
import AffiliateStatusImporterWorker from '@workers/affiliateStatusImporter';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import handlebars from 'handlebars';
import _ from 'lodash';
import { Sequelize, Transaction } from 'sequelize';

class SubOrderController {
  public async index (req: Request, res: Response) {
    try {
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { code, subOrderId, transportUnit } = req.query;
      const scopes: any = [
        { method: ['bySortOrder', sortBy, sortOrder] },
        'withItems',
        'withOrders',
      ];
      if (code) scopes.push({ method: ['byCode', code] });
      if (subOrderId) scopes.push({ method: ['byId', subOrderId] });
      if (transportUnit) scopes.push({ method: ['byTransportUnit', transportUnit] });
      const subOrders = await SubOrderModel.scope(scopes).findAll();
      sendSuccess(res, subOrders);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const { subOrderId } = req.params;
      const subOrder = await SubOrderModel.scope([
        { method: ['byId', subOrderId] },
        'withItems',
        'withOrderInfo',
        'withShippings',
      ]).findOne();
      if (!subOrder) { return sendError(res, 404, NoData); }
      sendSuccess(res, subOrder);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const { currentAdmin } = req;
      const { subOrderId } = req.params;
      const params = req.parameters.permit(SubOrderModel.UPDATABLE_PARAMETERS).value();
      const subOrder = await SubOrderModel.scope([
        { method: ['byId', subOrderId] },
      ]).findOne();
      if (!subOrder) { return sendError(res, 404, NoData); }
      const order = await subOrder.getOrder();
      const previousStatus = subOrder.status;
      if ([SubOrderModel.STATUS_ENUM.PENDING].includes(previousStatus) && params.status === SubOrderModel.STATUS_ENUM.WAITING_TO_TRANSFER) {
        params.adminConfirmId = currentAdmin.id;
      }
      SendNotification.changStatusOrder(params.status, order.orderableType, subOrder.code, order.orderableId);
      await subOrder.update(params, { validate: false });
      sendSuccess(res, subOrder);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async showBill (req: Request, res: Response) {
    try {
      const { subOrderId } = req.params;
      const subOrders = await SubOrderModel.scope([
        { method: ['byId', (subOrderId as string).split(',')] },
        'withItems',
        'withOrders',
      ]).findAll();
      if (subOrders.length === 0) { return sendError(res, 404, NoData); }
      const bills = await BillTemplateModel.findAll();
      subOrders.forEach(subOrder => {
        const order = subOrder.getDataValue('order');
        const bill = bills.find((record: any) => record.getDataValue('id') === subOrder.billId);
        const formatBill = BillTemplateModel.formatDataBill(order, subOrder);
        const template = handlebars.compile(bill.content);
        const htmlToSend = template(formatBill);
        bill.setDataValue('content', htmlToSend);
        subOrder.setDataValue('bill', bill);
      });
      sendSuccess(res, { subOrders });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async approveCancel (req: Request, res: Response) {
    try {
      const subOrder = await SubOrderModel.scope([
        { method: ['byCancelStatus', SubOrderModel.CANCEL_STATUS.PENDING] },
      ]).findByPk(req.params.subOrderId);
      if (!subOrder) return sendError(res, 404, NoData);
      const order = await subOrder.getOrder();
      await subOrder.update({ cancelStatus: SubOrderModel.CANCEL_STATUS.APPROVED, status: SubOrderModel.STATUS_ENUM.CANCEL }, { hooks: false, validate: false });
      SendNotification.notiCancelStatus(SubOrderModel.CANCEL_STATUS.APPROVED, order.orderableType, subOrder.code, order.orderableId);
      sendSuccess(res, { subOrder });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async rejectCancel (req: Request, res: Response) {
    try {
      const subOrder = await SubOrderModel.scope([
        { method: ['byCancelStatus', SubOrderModel.CANCEL_STATUS.PENDING] },
      ]).findByPk(req.params.subOrderId);
      if (!subOrder) return sendError(res, 404, NoData);
      const order = await subOrder.getOrder();
      await subOrder.update({ cancelStatus: SubOrderModel.CANCEL_STATUS.REJECTED, cancelRejectNote: req.body.cancelRejectNote }, { hooks: false, validate: false });
      SendNotification.notiCancelStatus(SubOrderModel.CANCEL_STATUS.REJECTED, order.orderableType, subOrder.code, order.orderableId);
      sendSuccess(res, { subOrder });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async updateFee (req: Request, res: Response) {
    try {
      const { subOrderId } = req.params;
      const subOrder = await SubOrderModel.findByPk(subOrderId);
      if (!subOrder) { return sendError(res, 404, NoData); }
      const order = await OrderModel.findByPk(subOrder.orderId);
      const previousFee = subOrder.shippingFee;
      const params = req.parameters.permit(SubOrderModel.UPDATABLE_FEE_PARAMETERS).value();
      await subOrder.update(params, { validator: false, hooks: false });
      await order.update({ shippingFee: order.shippingFee - previousFee + subOrder.shippingFee });
      sendSuccess(res, { subOrder });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async updateOtherdiscount (req: Request, res: Response) {
    try {
      const { subOrderId } = req.params;
      const subOrder = await SubOrderModel.findByPk(subOrderId);
      if (!subOrder) { return sendError(res, 404, NoData); }
      const params = req.parameters.permit(SubOrderModel.UPDATABLE_OTHER_DISCOUNT_PARAMETERS).value();
      params.totalOtherDiscount = _.sumBy(params.otherDiscounts, (record: any) => record.value);
      await subOrder.update(params, { validator: false, hooks: false });
      sendSuccess(res, { subOrder });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async indexItems (req: Request, res: Response) {
    try {
      const { subOrderIds } = req.query;
      const orderItems = await OrderItemModel.scope([
        { method: ['bySubOrder', (subOrderIds as string).split(',')] },
        'withTotalQuantity',
        'withVariant',
      ]).findAll({
        group: Sequelize.col('OrderItemModel.productVariantId'),
      });
      sendSuccess(res, { orderItems });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async download (req: Request, res: Response) {
    try {
      const time = dayjs().format('DD-MM-YY-hh:mm:ss');
      const fileName = `Bao-cao-danh-sach-san-pham-${time}.xlsx`;
      const { subOrderIds } = req.query;
      const orderItems = await OrderItemModel.scope([
        { method: ['bySubOrder', (subOrderIds as string).split(',')] },
        'withTotalQuantity',
        'withVariant',
      ]).findAll({
        group: Sequelize.col('OrderItemModel.productVariantId'),
      });
      const buffer: any = await XlsxService.downloadListOrderItems(orderItems);
      res.writeHead(200, [
        ['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        ['Content-Disposition', 'attachment; filename=' + `${fileName}`],
      ]);
      res.end(Buffer.from(buffer, 'base64'));
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async updateAffiliateStatus (req: Request, res: Response) {
    try {
      const { subOrderId } = req.params;
      const subOrder = await SubOrderModel.scope([
        'isAffiliateOrder',
      ]).findByPk(subOrderId);
      if (!subOrder || subOrder.affiliateStatus === SubOrderModel.AFFILIATE_STATUS.CONFIRM) {
        return sendError(res, 404, NoData);
      }
      const order = await subOrder.getOrder();
      const seller = await CollaboratorModel.scope([
        { method: ['byReferral', order.referralCode] },
      ]).findOne();
      await sequelize.transaction(async (transaction: Transaction) => {
        await subOrder.update({ affiliateStatus: SubOrderModel.AFFILIATE_STATUS.CONFIRM }, { validate: false, hooks: false, transaction });
        const moneyWalletChange: any = {
          ownerId: seller.id,
          type: MoneyWalletChangeModel.TYPE_ENUM.ADD,
          mutableType: MoneyWalletChangeModel.MUTABLE_TYPE.ORDER,
          mutableId: subOrder.id,
          amount: subOrder.affiliateDiscount,
        };
        await MoneyWalletChangeModel.create(moneyWalletChange, { transaction });
      });
      sendSuccess(res, { subOrder });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadAffiliateStatus (req: Request, res: Response) {
    try {
      const currentAdmin = req.currentAdmin || { id: 1 };
      const file = req.file;
      if (file.originalname.split('.').reverse()[0] !== 'xlsx') {
        sendError(res, 400, MissingImportFile);
      }
      const productImporterWorker = new AffiliateStatusImporterWorker(file.originalname, file, currentAdmin);
      await productImporterWorker.scheduleJob();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SubOrderController();
