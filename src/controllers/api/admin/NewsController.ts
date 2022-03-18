import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import NewsModel from '@models/news';
import NewsCategoryModel from '@models/newsCategories';
import { NoData } from '@libs/errors';

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

  public async update (req: Request, res: Response) {
    try {
      const { newsId } = req.params;
      const news = await NewsModel.findByPk(newsId);
      if (!news) return sendError(res, 404, NoData);
      const params = req.parameters.permit(NewsModel.UPDATABLE_PARAMETERS).value();
      const newsCategory = await NewsCategoryModel.findByPk(params.categoryId);
      if (!newsCategory) params.categoryId = null;
      await news.update(params);
      sendSuccess(res, news);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const { newsId } = req.params;
      const news = await NewsModel.findByPk(newsId);
      if (!news) sendError(res, 404, NoData);
      sendSuccess(res, { news });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new NewsController();
