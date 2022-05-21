import settings from '@configs/settings';
import { sendError, sendSuccess } from '@libs/response';
import HistoryEarnedPointModel from '@models/historyEarnedPoints';
import { Request, Response } from 'express';

class HistoryEarnedPointController {
  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (page - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { userId, userType, fromDate, toDate, type } = req.query;
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        { method: ['byCreatedAt', fromDate, toDate] },
        { method: ['byUser', userId, userType] },
      ];
      if (type) scopes.push({ method: ['byType', type] });
      const { rows, count } = await HistoryEarnedPointModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { historyEarnedPoints: rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new HistoryEarnedPointController();
