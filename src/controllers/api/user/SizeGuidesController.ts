import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import SizeGuideModel from '@models/sizeGuides';

class SystemSettingController {
  public async index (req: Request, res: Response) {
    try {
      const kidSizes = await SizeGuideModel.scope([
        { method: ['bySizeType', SizeGuideModel.SIZE_YPE_ENUM.KID_SIZE] },
      ]).findAll();
      const clothesSizes = await SizeGuideModel.scope([
        { method: ['bySizeType', SizeGuideModel.SIZE_YPE_ENUM.CLOTHES_SIZE] },
      ]).findAll();
      const shoesSizes = await SizeGuideModel.scope([
        { method: ['bySizeType', SizeGuideModel.SIZE_YPE_ENUM.SHOES_SIZE] },
      ]).findAll();
      sendSuccess(res, { kidSizes, clothesSizes, shoesSizes });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async indexQuery (req: Request, res: Response) {
    try {
      const sizeGuides = await SizeGuideModel.scope([
        { method: ['bySizeType', req.query.sizeType] },
      ]).findAll();
      sendSuccess(res, { sizeGuides });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SystemSettingController();
