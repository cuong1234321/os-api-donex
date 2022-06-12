import { sendError, sendSuccess } from '@libs/response';
import SubOrderModel from '@models/subOrders';
import { Request, Response } from 'express';

class GhnCallBackController {
  static readonly CALLBACK_PERMITTED_PARAMETERS = [
    'CODAmount', 'CODTransferDate', 'ClientOrderCode', 'Description', 'OrderCode', 'Reason', 'Status', 'Time', 'Type', 'Warehouse',
  ]

  public async orderStatus (req: Request, res: Response) {
    try {
      const params = req.body;
      const subOrder = await SubOrderModel.scope([
        { method: ['byOrderPartnerCode', params.OrderCode] },
      ]).findOne();
      if (!subOrder) { return sendSuccess(res, {}); }
      const updateParams: any = { status: params.Status };
      await subOrder.update(updateParams);
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new GhnCallBackController();
