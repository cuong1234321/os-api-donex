import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import BankAccountModel from '@models/bankAccounts';
import { NoData } from '@libs/errors';
import settings from '@configs/settings';
import ImageUploaderService from '@services/imageUploader';

class BankAccountController {
  public async index (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultNewsPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { status, bankId, freeWord } = req.query;
      const scopes: any = [
        { method: ['bySortOrder', sortBy, sortOrder] },
        'withBank',
      ];
      if (status) scopes.push({ method: ['byStatus', status] });
      if (freeWord) scopes.push({ method: ['byFreeWord', freeWord] });
      if (bankId) scopes.push({ method: ['byBank', bankId] });
      const { rows, count } = await BankAccountModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(BankAccountModel.CREATABLE_PARAMETERS).value();
      const bankAccounts = await BankAccountModel.create(params);
      sendSuccess(res, bankAccounts);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const { bankAccountId } = req.params;
      const bankAccounts = await BankAccountModel.findByPk(bankAccountId);
      if (!bankAccounts) return sendError(res, 404, NoData);
      const params = req.parameters.permit(BankAccountModel.UPDATABLE_PARAMETERS).value();
      await bankAccounts.update(params);
      sendSuccess(res, bankAccounts);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const { bankAccountId } = req.params;
      const bankAccounts = await BankAccountModel.findByPk(bankAccountId);
      if (!bankAccounts) return sendError(res, 404, NoData);
      bankAccounts.destroy();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadImageQRCode (req: Request, res: Response) {
    try {
      const { bankAccountId } = req.params;
      const bankAccounts = await BankAccountModel.findByPk(bankAccountId);
      if (!bankAccounts) return sendError(res, 404, NoData);
      const qrCode = await ImageUploaderService.singleUpload(req.file);
      await bankAccounts.update({
        qrCode,
      });
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const { bankAccountId } = req.params;
      const bankAccounts = await BankAccountModel.scope([
        { method: ['byId', bankAccountId] },
        'withBank',
      ]).findOne();
      if (!bankAccounts) sendError(res, 404, NoData);
      sendSuccess(res, { bankAccounts });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new BankAccountController();
