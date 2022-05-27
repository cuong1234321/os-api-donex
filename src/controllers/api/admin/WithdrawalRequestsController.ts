import { sendError, sendSuccess } from '@libs/response';
import WithdrawalRequestModel from '@models/withdrawalRequests';
import { Request, Response } from 'express';
import Settings from '@configs/settings';
import { NoData } from '@libs/errors';
import sequelize from '@initializers/sequelize';
import { Transaction } from 'sequelize';
import MoneyWalletChangeModel from '@models/moneyWalletChanges';

class WithdrawalRequestController {
  public async index (req: Request, res: Response) {
    try {
      const { freeWord, bankIds, status, createdAtFrom, createdAtTo, ownerId } = req.query;
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(Settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        'withBank', 'withOwner',
      ];
      if (createdAtFrom || createdAtTo) scopes.push({ method: ['byCreatedAt', createdAtFrom, createdAtTo] });
      if (status) { scopes.push({ method: ['byStatus', status] }); }
      if (bankIds) { scopes.push({ method: ['byBank', (bankIds as string).split(',')] }); }
      if (freeWord) { scopes.push({ method: ['byWithdrawalFreeWord', freeWord] }); }
      if (ownerId) { scopes.push({ method: ['byOwner', ownerId] }); }
      const { count, rows } = await WithdrawalRequestModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { requests: rows, pagination: { total: count, page, perPage: limit, offset } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const request = await WithdrawalRequestModel.scope([
        { method: ['byId', req.params.requestId] },
        'withBank', 'withOwner',
      ]).findOne();
      if (!request) return sendError(res, 404, NoData);
      sendSuccess(res, { request });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async approve (req: Request, res: Response) {
    try {
      const request = await WithdrawalRequestModel.scope([
        { method: ['byId', req.params.requestId] },
        'withBank',
      ]).findOne();
      if (!request) return sendError(res, 404, NoData);
      await sequelize.transaction(async (transaction: Transaction) => {
        await request.update({ status: WithdrawalRequestModel.STATUS_ENUM.APPROVED, approvalNote: req.body.approvalNote }, { transaction });
        await MoneyWalletChangeModel.create({
          id: undefined,
          ownerId: request.ownerId,
          type: MoneyWalletChangeModel.TYPE_ENUM.SUBTRACT,
          mutableType: MoneyWalletChangeModel.MUTABLE_TYPE.WITHDRAWAL_REQUEST,
          mutableId: request.id,
          amount: 0 - request.amount,
        });
      });
      sendSuccess(res, { request });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async reject (req: Request, res: Response) {
    try {
      const request = await WithdrawalRequestModel.scope([
        { method: ['byId', req.params.requestId] },
        'withBank',
      ]).findOne();
      if (!request) return sendError(res, 404, NoData);
      await request.update({ status: WithdrawalRequestModel.STATUS_ENUM.REJECTED, approvalNote: req.body.approvalNote });
      sendSuccess(res, { request });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new WithdrawalRequestController();
