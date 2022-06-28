import settings from '@configs/settings';
import { MissingImportFile } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import ProductVerifyCodeModel from '@models/productVerifyCodes';
import ProductVerifyImporterWorker from '@workers/productVerifyImporter';
import { Request, Response } from 'express';

class ProductVerifyCodeController {
  public async upload (req: Request, res: Response) {
    try {
      const currentAdmin = req.currentAdmin || { id: 1 };
      const file = req.file;
      if (file.originalname.split('.').reverse()[0] !== 'xlsx') {
        sendError(res, 400, MissingImportFile);
      }
      const productImporterWorker = new ProductVerifyImporterWorker(file.originalname, file, currentAdmin);
      await productImporterWorker.scheduleJob();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.size as string || settings.defaultPerPage);
      const offset = (page - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { freeWord, status } = req.query;
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
      ];
      if (freeWord) scopes.push({ method: ['byFreeWord', freeWord] });
      if (status === ProductVerifyCodeModel.STATUS_ENUM.USED) scopes.push('isUsed');
      if (status === ProductVerifyCodeModel.STATUS_ENUM.NOT_USE) scopes.push('isNotUse');
      const { rows, count } = await ProductVerifyCodeModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { productVerifyCodes: rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new ProductVerifyCodeController();
