import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import settings from '@configs/settings';
import NewsModel from '@models/news';
import NewsCategoryModel from '@models/newsCategories';

class NewsController {
  public async index (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const limit = parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const { status, categoryId, freeWord } = req.query;
      const scope: any = [];
      if (status) scope.push({ method: ['byStatus', status] });
      if (categoryId) scope.push({ method: ['byCategory', categoryId] });
      if (freeWord) scope.push({ method: ['byFreeWord', freeWord] });
      const { rows, count } = await NewsModel.scope(scope).findAndCountAll({ limit, offset });
      sendSuccess(res, { rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(NewsModel.CREATABLE_PARAMETERS).value();
      const newsCategory = await NewsCategoryModel.findByPk(params.categoryId);
      if (!newsCategory) params.categoryId = null;
      const news = await NewsModel.create(params);
      sendSuccess(res, news);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new NewsController();
