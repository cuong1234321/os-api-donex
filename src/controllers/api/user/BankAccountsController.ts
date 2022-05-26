import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import BankAccountModel from '@models/bankAccounts';

class BankAccountController {
  public async index (req: Request, res: Response) {
    try {
      const bankAccounts = await BankAccountModel.scope([
        'withBank',
        { method: ['byStatus', BankAccountModel.STATUS_ENUM.ACTIVE] },
      ]).findAll();
      sendSuccess(res, { bankAccounts });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new BankAccountController();
