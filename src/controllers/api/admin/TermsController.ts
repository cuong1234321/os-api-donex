import { NoData } from '@libs/errors';
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

  public async create (req: Request, res: Response) {
    try {
      const { type } = req.params;
      const params = req.parameters.permit(TermsModel.CREATABLE_PARAMETERS).value();
      const termCreatableParams = {
        ...params,
        type,
      };
      const term = await TermsModel.create(termCreatableParams);
      sendSuccess(res, term);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const { type, termId } = req.params;
      const params = req.parameters.permit(TermsModel.UPDATABLE_PARAMETERS).value();
      const term = await TermsModel.scope([
        { method: ['byType', type] },
        { method: ['byId', termId] },
      ]).findOne();
      if (!term) { return sendError(res, 404, NoData); }
      await term.update(params);
      sendSuccess(res, term);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const { type, termId } = req.params;
      const term = await TermsModel.scope([
        { method: ['byType', type] },
        { method: ['byId', termId] },
      ]).findOne();
      if (!term) { return sendError(res, 404, NoData); }
      await term.destroy();
      sendSuccess(res, term);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new TermController();
