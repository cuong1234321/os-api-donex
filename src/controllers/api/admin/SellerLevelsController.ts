import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import SellerLevelModel from '@models/sellerLevels';
import { Request, Response } from 'express';

class SellerLevelController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(SellerLevelModel.CREATABLE_PARAMETERS).value();
      const level = await SellerLevelModel.create(params);
      sendSuccess(res, level);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const { type } = req.query;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
      ];
      if (type) scopes.push({ method: ['byType', type] });
      const levels = await SellerLevelModel.scope(scopes).findAll();
      sendSuccess(res, levels);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const { levelId } = req.params;
      const level = await SellerLevelModel.findByPk(levelId);
      if (!level) { sendError(res, 404, NoData); }
      sendSuccess(res, level);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const { levelId } = req.params;
      const level = await SellerLevelModel.findByPk(levelId);
      if (!level) { sendError(res, 404, NoData); }
      const params = req.parameters.permit(SellerLevelModel.UPDATABLE_PARAMETERS).value();
      await level.update(params);
      await level.reload();
      sendSuccess(res, level);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const { levelId } = req.params;
      const level = await SellerLevelModel.findByPk(levelId);
      if (!level) { sendError(res, 404, NoData); }
      await level.destroy();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
};
export default new SellerLevelController();
