import settings from '@configs/settings';
import sequelize from '@initializers/sequelize';
import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import LookBookModel from '@models/lookBooks';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';

class LookBookController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(LookBookModel.CREATABLE_PARAMETERS).value();
      const lookBook = await LookBookModel.create(params);
      sendSuccess(res, { lookBook });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { status, freeWord } = req.query;
      const scopes: any = [
        { method: ['bySortOrder', sortBy, sortOrder] },
      ];
      if (status) {
        scopes.push({ method: ['byStatus', status] });
      }
      if (freeWord) { scopes.push({ method: ['byFreeWord', freeWord] }); }
      const { rows, count } = await LookBookModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const lookBook = await LookBookModel.findByPk(req.params.lookBookId);
      if (!lookBook) { return sendError(res, 404, NoData); }
      await lookBook.destroy();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const lookBook = await LookBookModel.scope([
        { method: ['byId', req.params.lookBookId] },
      ]).findOne();
      if (!lookBook) { return sendError(res, 404, NoData); }
      await lookBook.setDataValue('medias', await lookBook.getMedias());
      await lookBook.setDataValue('children', await lookBook.getChildren());
      sendSuccess(res, lookBook);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const lookBook = await LookBookModel.scope([
        { method: ['byId', req.params.lookBookId] },
      ]).findOne();
      if (!lookBook) { return sendError(res, 404, NoData); }
      const params = req.parameters.permit(LookBookModel.UPDATABLE_PARAMETERS).value();
      await sequelize.transaction(async (transaction: Transaction) => {
        await lookBook.updateMedias(params.medias, transaction);
        await lookBook.updateChildren(params.medias, transaction);
        await lookBook.update(params, { transaction });
      });
      sendSuccess(res, lookBook);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new LookBookController();
