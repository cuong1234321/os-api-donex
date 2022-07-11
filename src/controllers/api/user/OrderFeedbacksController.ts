import { sendError, sendSuccess } from '@libs/response';
import OrderFeedbackModel from '@models/orderFeedbacks';
import { Request, Response } from 'express';

class OrderFeedbackController {
  public async create (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      const params = req.parameters.permit(OrderFeedbackModel.CREATABLE_PARAMETERS).value();
      const feedback = await OrderFeedbackModel.create({
        ...params,
        creatableType: OrderFeedbackModel.CREATABLE_TYPE.USER,
        creatableId: currentUser.id,
      });
      sendSuccess(res, { feedback });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      const { subOrderId } = req.query;
      const sortBy = req.params.sortBy || 'createdAt';
      const sortOrder = req.params.sortOrder || 'DESC';
      const scopes: any = [
        { method: ['byCreatable', OrderFeedbackModel.CREATABLE_TYPE.USER, currentUser.id] },
        { method: ['bySorting', sortBy, sortOrder] },
      ];
      if (subOrderId) scopes.push({ method: ['bySubOrderId', subOrderId] });
      const feedbacks = await OrderFeedbackModel.scope(scopes).findAll();
      sendSuccess(res, { feedbacks });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new OrderFeedbackController();
