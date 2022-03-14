import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import NewsModel from '@models/news';
import NewsCategoryModel from '@models/newsCategories';

class NewsController {
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
