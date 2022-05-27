import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import TopUpDepositModel from '@models/topUpDeposits';
import { Request, Response } from 'express';

class TopUpDepositController {
  public async create (req: Request, res: Response) {
    try {
      const { currentSeller } = req;
      const params: any = {
        id: undefined,
        ownerId: currentSeller.id,
        type: req.body.type,
        amount: req.body.amount,
        createdAt: undefined,
        updatedAt: undefined,
      };
      const deposit = await TopUpDepositModel.create(params);
      sendSuccess(res, { deposit });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async reattemptPayment (req: Request, res: Response) {
    try {
      const { currentSeller } = req;
      const topUpOrder = await TopUpDepositModel.scope([
        { method: ['byStatus', TopUpDepositModel.STATUS_ENUM.PENDING] },
        { method: ['bySeller', currentSeller.id] },
        { method: ['byId', req.params.topUpDepositId] },
      ]).findOne();
      if (!topUpOrder) return sendError(res, 404, NoData);
      const paymentMethod = await topUpOrder.getPaymentMethod();
      sendSuccess(res, { topUpOrder, paymentMethod });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new TopUpDepositController();
