import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import PopupModel from '@models/popups';
import ImageUploaderService from '@services/imageUploader';
import { Request, Response } from 'express';

class PopupController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(PopupModel.CREATABLE_PARAMETERS).value();
      const popup = await PopupModel.create(params);
      sendSuccess(res, popup);
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

  public async uploadImage (req: Request, res: Response) {
    try {
      const popup = await PopupModel.findByPk(req.params.popupId);
      if (!popup) return sendError(res, 404, NoData);
      const image = await ImageUploaderService.singleUpload(req.file);
      await popup.update({ image });
      sendSuccess(res, popup);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}
export default new PopupController();
