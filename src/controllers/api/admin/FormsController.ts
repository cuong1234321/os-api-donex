import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { NoData } from '@libs/errors';
import MFormModel from '@models/mForms';

class FormController {
  public async index (req: Request, res: Response) {
    try {
      const forms = await MFormModel.scope([
        { method: ['bySortOrder', 'createdAt', 'DESC'] },
      ]).findAll();
      sendSuccess(res, { forms });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const form = await MFormModel.findByPk(req.params.formId);
      if (!form) { return sendError(res, 404, NoData); }
      sendSuccess(res, { form });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(MFormModel.CREATABLE_PARAMETERS).value();
      const form = await MFormModel.create(params);
      sendSuccess(res, { form });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(MFormModel.UPDATABLE_PARAMETERS).value();
      const form = await MFormModel.findByPk(req.params.formId);
      if (!form) { return sendError(res, 404, NoData); }
      await form.update(params);
      sendSuccess(res, { form });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const form = await MFormModel.findByPk(req.params.formId);
      if (!form) { return sendError(res, 404, NoData); }
      await form.destroy();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new FormController();
