import { sendError, sendSuccess } from '@libs/response';
import TermsModel from '@models/terms';
import { Request, Response } from 'express';

class TermController {
  public async index (req: Request, res: Response) {
    try {
      const { type } = req.params;
      const scopes: any = [];
      if (type) { scopes.push({ method: ['byType', type] }); }
      const terms = await TermsModel.scope(scopes).findAll();
      sendSuccess(res, terms);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new TermController();
