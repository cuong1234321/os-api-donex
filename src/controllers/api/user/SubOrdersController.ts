import settings from '@configs/settings';
import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import OrderModel from '@models/orders';
import SubOrderModel from '@models/subOrders';
import { Request, Response } from 'express';

class SubOrderController {
  public async index (req: Request, res:Response) {
    try {
      const { currentUser } = req;
      console.log(currentUser.id);
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        'withOrder',
        { method: ['byUser', currentUser.id] },
        { method: ['bySortOrder', sortBy, sortOrder] },
        'withItem',
      ];
      const { count, rows } = await SubOrderModel.scope(scopes).findAndCountAll({ limit, offset });
      const subOrders = await OrderModel.formatOrder(rows);
      sendSuccess(res, { rows: subOrders, pagination: { total: count, page, perPage: limit } });
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

  public async update (req: Request, res: Response) {

  }
}

export default new SubOrderController();
