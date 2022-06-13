import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import BillTemplateModel from '@models/billTemplates';
import OrderModel from '@models/orders';
import SubOrderModel from '@models/subOrders';
import SendNotification from '@services/notification';
import { Request, Response } from 'express';
import handlebars from 'handlebars';
import _ from 'lodash';

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
      if (previousStatus === SubOrderModel.STATUS_ENUM.PENDING && subOrder.status === SubOrderModel.STATUS_ENUM.WAITING_TO_TRANSFER) {
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
}

export default new SubOrderController();
