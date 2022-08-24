import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { NoData } from '@libs/errors';
import MFormModel from '@models/mForms';
import dayjs from 'dayjs';
import XlsxService from '@services/xlsx';

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

  public async download (req: Request, res: Response) {
    try {
      const time = dayjs().format('DD-MM-YY-hh:mm:ss');
      const fileName = `Danh-sach-form-${time}.xlsx`;
      const forms = await MFormModel.findAll();
      const buffer: any = await XlsxService.downloadForms(forms);
      res.writeHead(200, [
        ['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        ['Content-Disposition', 'attachment; filename=' + `${fileName}`],
      ]);
      res.end(Buffer.from(buffer, 'base64'));
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new FormController();
