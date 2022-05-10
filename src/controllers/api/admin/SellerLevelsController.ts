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
};
export default new SellerLevelController();
