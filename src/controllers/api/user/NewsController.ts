import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import settings from '@configs/settings';
import NewsModel from '@models/news';
import { NoData } from '@libs/errors';

class NewsController {
  public async index (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const limit = parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const { categoryId, freeWord } = req.query;
      const scopes: any = [
        { method: ['byStatus', NewsModel.STATUS_ENUM.ACTIVE] },
      ];
      if (categoryId) scopes.push({ method: ['byCategory', categoryId] });
      if (freeWord) scopes.push({ method: ['byFreeWord', freeWord] });
      const { rows, count } = await NewsModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { news: rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const { newsId } = req.params;
      const news = await NewsModel.scope([
        { method: ['byStatus', NewsModel.STATUS_ENUM.ACTIVE] },
        { method: ['byId', newsId] },
      ]).findOne();
      if (!news) sendError(res, 404, NoData);
      sendSuccess(res, { news });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new NewsController();
