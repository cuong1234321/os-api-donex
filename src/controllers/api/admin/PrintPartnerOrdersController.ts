import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import SubOrderModel from '@models/subOrders';
import ExtractPartnerOrder from '@repositories/models/extractParterOrders';

class PrintPartnerOrderController {
  public async show (req: Request, res: Response) {
    try {
      const { subOrderIds } = req.query;
      const subOrders = await SubOrderModel.scope([
        { method: ['byId', (subOrderIds as string).split(',')] },
        'withPartnerCode',
      ]).findAll();
      const partnerCodeIds = subOrders.map((record: any) => record.orderPartnerCode);
      const token = await ExtractPartnerOrder.generateToken(partnerCodeIds);
      const result = await ExtractPartnerOrder.printOrder(token);
      sendSuccess(res, { result });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new PrintPartnerOrderController();
