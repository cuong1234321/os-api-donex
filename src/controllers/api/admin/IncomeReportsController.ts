import settings from '@configs/settings';
import { sendError, sendSuccess } from '@libs/response';
import CollaboratorModel from '@models/collaborators';
import { Request, Response } from 'express';

class IncomeReportController {
  public async sellerIncome (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.size as string || settings.defaultPerPage);
      const offset = (page - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { fromDate, toDate, freeWord, discountFrom, discountTo, incomeFrom, incomeTo } = req.query;
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        { method: ['withTotalListedPrice', fromDate, toDate] },
        { method: ['withTotalDiscount', fromDate, toDate] },
      ];
      if (freeWord) scopes.push({ method: ['byFreeWord', freeWord] });
      if (incomeFrom && incomeTo) scopes.push({ method: ['byTotalListedPrice', incomeFrom, incomeTo, fromDate, toDate] });
      if (discountFrom && discountTo) scopes.push({ method: ['byTotalDiscount', discountFrom, discountTo, fromDate, toDate] });
      const { rows, count } = await CollaboratorModel.scope(scopes).findAndCountAll({ limit, offset, distinct: true, col: 'CollaboratorModel.id' });
      sendSuccess(res, { admins: rows, pagination: { total: count, page, perpage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}
export default new IncomeReportController();
