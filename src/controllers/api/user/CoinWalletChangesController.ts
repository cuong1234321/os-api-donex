import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import Settings from '@configs/settings';
import CoinWalletChangeModel from '@models/coinWalletChanges';

class CoinWalletChangeController {
  public async index (req: Request, res: Response) {
    try {
      const { createdAtFrom, createdAtTo, type } = req.query;
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(Settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        { method: ['byUser', req.currentUser.id] },
      ];
      if (createdAtFrom || createdAtTo) scopes.push({ method: ['byCreatedAt', createdAtFrom, createdAtTo] });
      if (type) scopes.push({ method: ['byType', type] });
      const { count, rows } = await CoinWalletChangeModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { results: rows, pagination: { total: count, page, perPage: limit, offset } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new CoinWalletChangeController();
