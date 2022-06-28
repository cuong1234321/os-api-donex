import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import NewsCategoryModel from '@models/newsCategories';

class NewsCategoryController {
  public async index (req: Request, res: Response) {
    try {
      const { freeWord } = req.query;
      const newsCategories = await NewsCategoryModel.scope([
        { method: ['byFreeWord', freeWord] },
        { method: ['bySortOrder', 'index', 'DESC'] },
      ]).findAll();
      sendSuccess(res, newsCategories);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new NewsCategoryController();
