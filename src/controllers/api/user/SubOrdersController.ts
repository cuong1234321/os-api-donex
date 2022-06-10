import settings from '@configs/settings';
import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import OrderModel from '@models/orders';
import SubOrderModel from '@models/subOrders';
import Order from '@repositories/models/orders';
import { Request, Response } from 'express';

class SubOrderController {
  public async index (req: Request, res:Response) {
    try {
      const { currentUser } = req;
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { status, transportUnit } = req.query;
      const scopes: any = [
        'withOrder',
        { method: ['byUser', currentUser.id] },
        { method: ['bySortOrder', sortBy, sortOrder] },
        'withItem',
      ];
      if (status) {
        if (SubOrderModel.DELIVERY_STATUS_ENUM.includes(status as string)) {
          scopes.push({ method: ['byDeliveryStatus', status] });
        } else {
          scopes.push({ method: ['byStatus', status] });
        }
      }
      if (transportUnit) scopes.push({ method: ['byTransportUnit', transportUnit] });
      const { count, rows } = await SubOrderModel.scope(scopes).findAndCountAll({ limit, offset });
      const subOrders = await OrderModel.formatOrder(rows);
      const statisticalOrder = await this.statistical(currentUser);
      sendSuccess(res, { rows: subOrders, statisticalOrder, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const { currentUser } = req;
      const subOrder = await SubOrderModel.scope([
        { method: ['byId', req.params.subOrderId] },
        'withItem',
      ]).findOne();
      if (!subOrder) return sendError(res, 404, NoData);
      const order = await OrderModel.scope([
        { method: ['byOwnerId', currentUser.id] },
        { method: ['byId', subOrder.orderId] },
        'withShippingAddress',
      ]).findOne();
      if (!order) return sendError(res, 404, NoData);
      const subOrders = await OrderModel.formatOrder([subOrder]);
      order.setDataValue('subOrders', subOrders);
      sendSuccess(res, { order });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async getOrderPlatform (req: Request, res: Response) {
    try {
      const { currentUser } = req;
      const subOrder = await SubOrderModel.scope([
        { method: ['byId', req.params.subOrderId] },
        { method: ['byUser', currentUser.id] },
      ]).findOne();
      if (!subOrder) return sendError(res, 404, NoData);
      const orderPlatform = await Order.getDeliveryPartner(subOrder);
      sendSuccess(res, { orderPlatform });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  private async statistical (currentUser: any) {
    const totalOrder = await SubOrderModel.scope([
      { method: ['byOrderAble', currentUser.id, OrderModel.ORDERABLE_TYPE.USER] },
      'isNotDraft',
    ]).count();
    const totalPending = await SubOrderModel.scope([
      { method: ['byOrderAble', currentUser.id, OrderModel.ORDERABLE_TYPE.USER] },
      { method: ['byStatus', SubOrderModel.STATUS_ENUM.PENDING] },
    ]).count();
    const totalWaitingToTransfer = await SubOrderModel.scope([
      { method: ['byOrderAble', currentUser.id, OrderModel.ORDERABLE_TYPE.USER] },
      { method: ['byStatus', SubOrderModel.STATUS_ENUM.WAITING_TO_TRANSFER] },
    ]).count();
    const totalDelivery = await SubOrderModel.scope([
      { method: ['byOrderAble', currentUser.id, OrderModel.ORDERABLE_TYPE.USER] },
      { method: ['byStatus', SubOrderModel.STATUS_ENUM.DELIVERY] },
    ]).count();
    const totalDelivered = await SubOrderModel.scope([
      { method: ['byOrderAble', currentUser.id, OrderModel.ORDERABLE_TYPE.USER] },
      { method: ['byStatus', [SubOrderModel.STATUS_ENUM.DELIVERED, SubOrderModel.STATUS_ENUM.WAITING_TO_PAY]] },
    ]).count();
    const totalCancel = await SubOrderModel.scope([
      { method: ['byOrderAble', currentUser.id, OrderModel.ORDERABLE_TYPE.USER] },
      { method: ['byStatus', SubOrderModel.STATUS_ENUM.CANCEL] },
    ]).count();
    const totalReturn = await SubOrderModel.scope([
      { method: ['byOrderAble', currentUser.id, OrderModel.ORDERABLE_TYPE.USER] },
      { method: ['byStatus', SubOrderModel.STATUS_ENUM.RETURNED] },
    ]).count();
    const totalFail = await SubOrderModel.scope([
      { method: ['byOrderAble', currentUser.id, OrderModel.ORDERABLE_TYPE.USER] },
      { method: ['byStatus', SubOrderModel.STATUS_ENUM.FAIL] },
    ]).count();
    const totalReject = await SubOrderModel.scope([
      { method: ['byOrderAble', currentUser.id, OrderModel.ORDERABLE_TYPE.USER] },
      { method: ['byStatus', SubOrderModel.STATUS_ENUM.REJECT] },
    ]).count();
    const totalRefund = await SubOrderModel.scope([
      { method: ['byOrderAble', currentUser.id, OrderModel.ORDERABLE_TYPE.USER] },
      { method: ['byStatus', SubOrderModel.STATUS_ENUM.REFUND] },
    ]).count();
    const statisticalOrder = {
      totalOrder,
      totalPending,
      totalWaitingToTransfer,
      totalDelivery,
      totalDelivered,
      totalCancel,
      totalReturn,
      totalFail,
      totalReject,
      totalRefund,
    };
    return statisticalOrder;
  }
}

export default new SubOrderController();
