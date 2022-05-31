import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import SubOrderModel from '@models/subOrders';
import OrderModel from '@models/orders';
import { NoData } from '@libs/errors';
import RatingModel from '@models/ratings';
import ImageUploaderService from '@services/imageUploader';
import RatingImageModel from '@models/ratingImages';
import ProductVariantModel from '@models/productVariants';
import settings from '@configs/settings';

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

  public async index (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultNewsPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { productId, point } = req.query;
      const productVariants = await ProductVariantModel.scope([
        { method: ['byProduct', productId] },
      ]).findAll({ attributes: ['id'] });
      if (!productVariants.length) {
        return sendSuccess(res, { rows: [], pagination: { total: 0, page, perPage: limit } });
      }
      const productVariantIds = productVariants.map((record: any) => record.id);
      const scopes: any = [
        'withImage',
        { method: ['byProductVariantId', productVariantIds] },
        { method: ['bySortOrder', sortBy, sortOrder] },
        { method: ['byStatus', RatingModel.STATUS_ENUM.ACTIVE] },
        'withUserInfo',
      ];
      if (point) { scopes.push({ method: ['byPoint', point] }); }
      const { rows, count } = await RatingModel.scope(scopes).findAndCountAll({ limit, offset });
      const totalRatings = await RatingModel.scope([
        { method: ['byProductVariantId', productVariantIds] },
        { method: ['byStatus', RatingModel.STATUS_ENUM.ACTIVE] },
      ]).count();
      return sendSuccess(res, { rows, totalRatings, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new RatingController();
