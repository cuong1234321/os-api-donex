import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import FavoriteProductModel from '@models/favoriteProducts';
import ProductModel from '@models/products';
import { alreadyFavoriteProduct, NoData } from '@libs/errors';
import settings from '@configs/settings';

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

  public async delete (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      const { productId } = req.params;
      const favoriteProduct = await FavoriteProductModel.scope([
        { method: ['byUser', currentUser.id] },
        { method: ['byProduct', productId] },
      ]).findOne();
      if (!favoriteProduct) { return sendError(res, 404, NoData); }
      await favoriteProduct.destroy();
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const { currentUser } = req;
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        { method: ['byUser', currentUser.id] },
        'withProduct',
      ];
      const { count, rows } = await FavoriteProductModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { products: rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new FavoriteProductController();
