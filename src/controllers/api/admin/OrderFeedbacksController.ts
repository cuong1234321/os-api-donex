import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import OrderFeedbackModel from '@models/orderFeedbacks';
import { Request, Response } from 'express';

class OrderFeedbackController {
  public async show (req: Request, res: Response) {
    try {
      const { feedbackId } = req.params;
      const feedback = await OrderFeedbackModel.findByPk(feedbackId);
      if (!feedback) {
        return sendError(res, 404, NoData);
      }
      sendSuccess(res, { feedback });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async confirm (req: Request, res: Response) {
    try {
      const { currentAdmin } = req;
      const { feedbackId } = req.params;
      const feedback = await OrderFeedbackModel.findByPk(feedbackId);
      if (!feedback) {
        return sendError(res, 404, NoData);
      }
      await feedback.update({ status: OrderFeedbackModel.STATUS_ENUM.CONFIRM, adminConfirmId: currentAdmin.id });
      sendSuccess(res, { feedback });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async reject (req: Request, res: Response) {
    try {
      const { currentAdmin } = req;
      const { feedbackId } = req.params;
      const feedback = await OrderFeedbackModel.findByPk(feedbackId);
      if (!feedback) {
        return sendError(res, 404, NoData);
      }
      await feedback.update({ status: OrderFeedbackModel.STATUS_ENUM.REJECT, adminConfirmId: currentAdmin.id, rejectReason: req.body.rejectReason });
      sendSuccess(res, { feedback });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new OrderFeedbackController();
