import { MissingImportFile } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
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
}

export default new ProductVerifyCodeController();
