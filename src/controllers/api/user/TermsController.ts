import { sendError, sendSuccess } from '@libs/response';
import TermsModel from '@models/terms';
import { Request, Response } from 'express';

class TermController {
  public async show (req: Request, res: Response) {
    try {
      const { type } = req.params;
      const terms = (await TermsModel.findOrCreate({
        where: { type },
        defaults: {
          id: undefined,
          type,
          title: '',
          content: '',
        },
      }))[0];
      sendSuccess(res, terms);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new TermController();
