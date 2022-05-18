import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import PopupModel from '@models/popups';
import { Request, Response } from 'express';
class PopupController {
  public async index (req: Request, res: Response) {
    try {
      const popups = await PopupModel.scope([
        'isActive',
      ]).findAll();
      sendSuccess(res, popups);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const popup = await PopupModel.findByPk(req.params.popupId);
      if (!popup) return sendError(res, 404, NoData);
      sendSuccess(res, popup);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}
export default new PopupController();
