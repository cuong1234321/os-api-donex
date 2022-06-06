import { sendError, sendSuccess } from '@libs/response';
import WithdrawalRequestModel from '@models/withdrawalRequests';
import { Request, Response } from 'express';
import Settings from '@configs/settings';

class WithdrawalRequestController {
  public async index (req: Request, res: Response) {
    try {
      const { createdAtFrom, createdAtTo } = req.query;
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(Settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        { method: ['byOwner', req.currentSeller.id] },
        'withBank',
      ];
      if (createdAtFrom || createdAtTo) scopes.push({ method: ['byCreatedAt', createdAtFrom, createdAtTo] });
      const { count, rows } = await WithdrawalRequestModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { requests: rows, pagination: { total: count, page, perPage: limit, offset } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const { currentSeller } = req;
      const params = req.parameters.permit(WithdrawalRequestModel.CREATABLE_PARAMETERS).value();
      const request = await WithdrawalRequestModel.create({ ...params, ownerId: currentSeller.id });
      sendSuccess(res, { request });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new WithdrawalRequestController();
