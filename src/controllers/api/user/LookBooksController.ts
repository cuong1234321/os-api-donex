import settings from '@configs/settings';
import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import LookBookModel from '@models/lookBooks';
import { Request, Response } from 'express';

class LookBookController {
  public async index (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { freeWord } = req.query;
      const scopes: any = [
        { method: ['bySortOrder', sortBy, sortOrder] },
      ];
      if (freeWord) { scopes.push({ method: ['byFreeWord', freeWord] }); }
      const { rows, count } = await LookBookModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const lookBook = await LookBookModel.scope([
        { method: ['byId', req.params.lookBookId] },
        { method: ['byStatus', LookBookModel.STATUS_ENUM.ACTIVE] },
      ]).findOne();
      if (!lookBook) { return sendError(res, 404, NoData); }
      await lookBook.setDataValue('medias', await lookBook.getMedias());
      await lookBook.setDataValue('children', await lookBook.getChildren());
      sendSuccess(res, lookBook);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new LookBookController();
