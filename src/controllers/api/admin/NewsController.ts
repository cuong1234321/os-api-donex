import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import settings from '@configs/settings';
import NewsModel from '@models/news';
import { NoData } from '@libs/errors';
import ImageUploaderService from '@services/imageUploader';

class NewsController {
  public async index (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultNewsPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'index';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { status, categoryId, freeWord } = req.query;
      const scopes: any = [
        'withNewCategory',
        { method: ['bySortOrder', sortBy, sortOrder] },
      ];
      if (status) scopes.push({ method: ['byStatus', status] });
      if (categoryId) scopes.push({ method: ['byCategory', categoryId] });
      if (freeWord) scopes.push({ method: ['byFreeWord', freeWord] });
      const { rows, count } = await NewsModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(NewsModel.CREATABLE_PARAMETERS).value();
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
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const { newsId } = req.params;
      const news = await NewsModel.scope([
        'withNewCategory',
        { method: ['byId', newsId] },
      ]).findOne();
      if (!news) sendError(res, 404, NoData);
      sendSuccess(res, { news });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async active (req: Request, res: Response) {
    try {
      const { newsId } = req.params;
      const news = await NewsModel.scope([
        { method: ['byId', newsId] },
        { method: ['byStatus', [NewsModel.STATUS_ENUM.INACTIVE, NewsModel.STATUS_ENUM.DRAFT]] },
      ]).findOne();
      if (!news) return sendError(res, 404, NoData);
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
      const news = await NewsModel.scope([
        { method: ['byId', newsId] },
        { method: ['byStatus', [NewsModel.STATUS_ENUM.ACTIVE, NewsModel.STATUS_ENUM.DRAFT]] },
      ]).findOne();
      if (!news) return sendError(res, 404, NoData);
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
      news.destroy();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new NewsController();
