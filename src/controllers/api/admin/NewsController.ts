import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import settings from '@configs/settings';
import NewsModel from '@models/news';
import NewsCategoryModel from '@models/newsCategories';
import { NoData } from '@libs/errors';
import ImageUploaderService from '@services/imageUploader';

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

  public async uploadThumbnail (req: Request, res: Response) {
    try {
      const { newsId } = req.params;
      const news = await NewsModel.findByPk(newsId);
      if (!news) return sendError(res, 404, NoData);
      const thumbnail = await ImageUploaderService.singleUpload(req.file);
      await news.update({
        thumbnail,
      });
      sendSuccess(res, { user: news });
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

  public async active (req: Request, res: Response) {
    try {
      const { newsId } = req.params;
      const news = await NewsModel.findByPk(newsId);
      if (!news || news.status === NewsModel.STATUS_ENUM.ACTIVE) return sendError(res, 404, NoData);
      await news.update({
        status: NewsModel.STATUS_ENUM.ACTIVE,
      });
      sendSuccess(res, { news });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async inactive (req: Request, res: Response) {
    try {
      const { newsId } = req.params;
      const news = await NewsModel.findByPk(newsId);
      if (!news || news.status !== NewsModel.STATUS_ENUM.ACTIVE) return sendError(res, 404, NoData);
      await news.update({
        status: NewsModel.STATUS_ENUM.INACTIVE,
      });
      sendSuccess(res, { news });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const { newsId } = req.params;
      const news = await NewsModel.findByPk(newsId);
      if (!news) return sendError(res, 404, NoData);
      await news.destroy();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new NewsController();
