import { NoData } from '@libs/errors';
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
}

export default new SubOrderController();
