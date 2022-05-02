import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import SubOrderModel from '@models/subOrders';
import OrderModel from '@models/orders';
import { NoData } from '@libs/errors';
import RatingModel from '@models/ratings';
import ImageUploaderService from '@services/imageUploader';
import RatingImageModel from '@models/ratingImages';

class RatingController {
  public async create (req: Request, res: Response) {
    try {
      const { currentUser } = req;
      const userOrder = await SubOrderModel.scope([
        { method: ['byId', req.params.subOrderId] },
        { method: ['byOrderAble', currentUser.id, OrderModel.ORDERABLE_TYPE.USER] },
      ]).findOne();
      if (!userOrder) return sendError(res, 404, NoData);
      const params = req.parameters.permit(RatingModel.CREATABLE_PARAMETERS).value();
      const rating = await RatingModel.create({
        ...params,
        creatableId: currentUser.id,
        creatableType: RatingModel.CREATABLE_ENUM.USER,
        subOrderId: req.params.subOrderId,
        productVariantId: req.params.productVariantId,
      });
      sendSuccess(res, { rating });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadImage (req: Request, res: Response) {
    try {
      const { ratingId } = req.params;
      const rating = await RatingModel.scope([
        { method: ['byId', ratingId] },
      ]).findOne();
      if (!rating) { return sendError(res, 404, NoData); }
      const files: any[] = req.files as any[];
      const ratingImageAttributes: any = [];
      for (const file of files) {
        const image = await ImageUploaderService.singleUpload(file);
        ratingImageAttributes.push({ ratingAbleId: ratingId, image });
      }
      await RatingImageModel.bulkCreate(ratingImageAttributes);
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new RatingController();
