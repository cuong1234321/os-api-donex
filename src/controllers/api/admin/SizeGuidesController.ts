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

  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(SizeGuideModel.CREATABLE_PARAMETERS).value();
      await SizeGuideModel.create(params);
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(SizeGuideModel.UPDATABLE_PARAMETERS).value();
      const sizeGuide = await SizeGuideModel.findByPk(req.params.sizeGuideId);
      await sizeGuide.update(params);
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const sizeGuide = await SizeGuideModel.findByPk(req.params.sizeGuideId);
      await sizeGuide.destroy();
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SystemSettingController();
