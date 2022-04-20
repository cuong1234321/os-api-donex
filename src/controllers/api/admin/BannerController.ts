import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import BannerModel from '@models/banners';
import settings from '@configs/settings';

class BannerController {
  public async index (req: Request, res: Response) {
    try {
      const { title, isHighlight, position, type } = req.query;
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(settings.defaultPerPage);
      const offset = (page - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
      ];
      if (title) scopes.push({ method: ['byTitle', title] });
      if (position) { scopes.push({ method: ['byPosition', position] }); }
      if (type) { scopes.push({ method: ['byType', type] }); }
      if (isHighlight === 'true') scopes.push('active', 'byOrderSorting');
      const { count, rows } = await BannerModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { banners: rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(BannerModel.CREATABLE_PARAMETERS).value();
      const banners = await BannerModel.create(params);
      sendSuccess(res, banners);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new BannerController();
