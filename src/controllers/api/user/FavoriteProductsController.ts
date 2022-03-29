import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import FavoriteProductModel from '@models/favoriteProducts';
import ProductModel from '@models/products';
import { alreadyFavoriteProduct, NoData } from '@libs/errors';

class FavoriteProductController {
  public async create (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      const { productId } = req.body;
      const product = await ProductModel.scope([
        'isActive',
        { method: ['byId', productId] },
      ]).findOne();
      if (!product) { return sendError(res, 404, NoData); }
      const productAlreadyFavorited = await FavoriteProductModel.scope([
        { method: ['byUser', currentUser.id] },
        { method: ['byProduct', productId] },
      ]).findOne();
      if (productAlreadyFavorited) { return sendError(res, 403, alreadyFavoriteProduct); }
      const params: any = {
        userId: currentUser.id,
        productId: parseInt(productId),
      };
      const favoriteProduct = await FavoriteProductModel.create(params);
      sendSuccess(res, favoriteProduct);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new FavoriteProductController();
