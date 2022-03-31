import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { NoData } from '@libs/errors';
import NewsCategoryModel from '@models/newsCategories';

class NewsCategoryController {
  public async index (req: Request, res: Response) {
    try {
      const { freeWord } = req.query;
      const newsCategories = await NewsCategoryModel.scope([
        { method: ['byFreeWord', freeWord] },
      ]).findAll();
      sendSuccess(res, newsCategories);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const newsCategory = await NewsCategoryModel.findByPk(req.params.newsCategoryId);
      if (!newsCategory) { return sendError(res, 404, NoData); }
      sendSuccess(res, newsCategory);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(NewsCategoryModel.CREATABLE_PARAMETERS).value();
      const newsCategory = await NewsCategoryModel.create(params);
      sendSuccess(res, newsCategory);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(NewsCategoryModel.UPDATABLE_PARAMETERS).value();
      const newsCategory = await NewsCategoryModel.findByPk(req.params.newsCategoryId);
      await newsCategory.update(params);
      sendSuccess(res, newsCategory);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const newsCategory = await NewsCategoryModel.findByPk(req.params.newsCategoryId);
      if (!newsCategory) { return sendError(res, 404, NoData); }
      await newsCategory.destroy();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new NewsCategoryController();
