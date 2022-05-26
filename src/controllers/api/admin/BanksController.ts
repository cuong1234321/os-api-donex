import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import MBankModel from '@models/mBanks';

class BankController {
  public async index (req: Request, res: Response) {
    try {
      const banks = await MBankModel.scope([{ method: ['byKeyword', req.query.keyword] }]).findAll();
      sendSuccess(res, { banks });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new BankController();
