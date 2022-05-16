import { NoData } from '@libs/errors';
import settings from '@configs/settings';
import { sendError, sendSuccess } from '@libs/response';
import SubOrderModel from '@models/subOrders';
import { Request, Response } from 'express';

class SubOrderController {
  public async show (req: Request, res: Response) {
    try {
      const { subOrderId } = req.params;
      const currentSeller = req.currentSeller;
      const subOrder = await SubOrderModel.scope([
        { method: ['byId', subOrderId] },
        { method: ['byOrderAble', currentSeller.id, currentSeller.type] },
        'withItems',
      ]).findOne();
      if (!subOrder) { return sendError(res, 404, NoData); }
      sendSuccess(res, subOrder);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async PurchaseReport (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.size as string || settings.defaultPerPage);
      const offset = (page - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { fromDate, toDate } = req.query;
      const scopes: any = [
        { method: ['byOrderAble', currentSeller.id, currentSeller.type] },
        { method: ['bySortOrder', sortBy, sortOrder] },
        { method: ['byDate', fromDate, toDate] },
        'withFinalAmount',
      ];
      const subOrders = await SubOrderModel.scope(scopes).findAndCountAll({ limit, offset, distinct: true, col: 'SubOrderModel.id' });
      sendSuccess(res, { subOrders: subOrders.rows, pagination: { total: subOrders.count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SubOrderController();
