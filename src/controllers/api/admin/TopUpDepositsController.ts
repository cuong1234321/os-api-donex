import settings from '@configs/settings';
import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import TopUpDepositModel from '@models/topUpDeposits';
import { Request, Response } from 'express';

class TopUpDepositController {
  public async index (req: Request, res: Response) {
    try {
      const { freeWord, type, status, dateFrom, dateTo } = req.query;
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        'withSeller',
        { method: ['byDate', dateFrom, dateTo] },
      ];
      if (status) { scopes.push({ method: ['byStatus', status] }); }
      if (type) { scopes.push({ method: ['byType', type] }); }
      if (freeWord) { scopes.push({ method: ['byDepositorFreeWord', freeWord] }); }
      const totalAmount = await TopUpDepositModel.scope(scopes).sum('amount');
      const { count, rows } = await TopUpDepositModel.scope([...scopes, { method: ['bySortOrder', sortBy, sortOrder] }]).findAndCountAll({ limit, offset });
      sendSuccess(res, { totalAmount, rows, pagination: { total: count, page, perPage: limit, offset } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const topUpDeposit = await TopUpDepositModel.scope(['withSeller']).findByPk(req.params.topUpDepositId);
      if (!topUpDeposit) return sendError(res, 404, NoData);
      sendSuccess(res, { topUpDeposit });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(TopUpDepositModel.ADMIN_CREATABLE_PARAMETERS).value();
      const topUpDeposit = await TopUpDepositModel.create({ ...params, creatableType: TopUpDepositModel.CREATABLE_TYPE_ENUM.ADMIN });
      sendSuccess(res, { topUpDeposit });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const topUpDeposit = await TopUpDepositModel.findByPk(req.params.topUpDepositId);
      const params = req.parameters.permit(TopUpDepositModel.ADMIN_UPDATABLE_PARAMETERS).value();
      if (!topUpDeposit || topUpDeposit.status === TopUpDepositModel.STATUS_ENUM.COMPLETE) {
        return sendError(res, 404, NoData);
      }
      await topUpDeposit.update(params);
      sendSuccess(res, { topUpDeposit });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const topUpDeposit = await TopUpDepositModel.findByPk(req.params.topUpDepositId);
      if (!topUpDeposit || topUpDeposit.status === TopUpDepositModel.STATUS_ENUM.COMPLETE || topUpDeposit.creatableType !== TopUpDepositModel.CREATABLE_TYPE_ENUM.ADMIN) {
        return sendError(res, 404, NoData);
      }
      await topUpDeposit.destroy();
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new TopUpDepositController();
