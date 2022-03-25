import settings from '@configs/settings';
import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import PopupModel from '@models/popups';
import ImageUploaderService from '@services/imageUploader';
import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
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

  public async index (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const { applyAtOrder, applyToOrder } = req.query;
      const orderConditions: any = [];
      if (applyAtOrder) orderConditions.push([Sequelize.literal('applyAt'), applyAtOrder]);
      if (applyToOrder) orderConditions.push([Sequelize.literal('applyTo'), applyToOrder]);
      const popups = await PopupModel.scope([
        { method: ['bySortOrder', orderConditions] },
      ]).findAndCountAll({ limit, offset, distinct: true, col: 'PopupModel.id' });
      popups.rows = await PopupModel.getStatus(popups.rows);
      sendSuccess(res, { popups: popups.rows, pagination: { total: popups.count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const popup = await PopupModel.findByPk(req.params.popupId);
      if (!popup) return sendError(res, 404, NoData);
      const params = req.parameters.permit(PopupModel.UPDATABLE_PARAMETERS).value();
      await popup.update(params);
      sendSuccess(res, popup);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const popup = await PopupModel.findByPk(req.params.popupId);
      if (!popup) return sendError(res, 404, NoData);
      await popup.destroy();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}
export default new PopupController();
