import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import Settings from '@configs/settings';
import ProductModel from '@models/products';
import { Sequelize } from 'sequelize';
import ProductCategoryModel from '@models/productCategories';
import ProductOptionModel from '@models/productOptions';
import { NoData } from '@libs/errors';
class ProductController {
  public async index (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      const { categoryIds, genderIds, productTypeIds, collectionIds, priceFrom, priceTo, createdAtOrder, priceOrder, freeWord, colorIds, sizeIds } = req.query;
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(Settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const orderConditions: any = [];
      const scopes: any = [
        'isActive',
        'withThumbnail',
      ];
      if (categoryIds) {
        const listCategoryId = await ProductCategoryModel.getCategoryIdsByParentId((categoryIds as string).split(','));
        scopes.push({ method: ['byCategory', listCategoryId] });
      }
      if (collectionIds) scopes.push({ method: ['byCollectionId', (collectionIds as string).split(',')] });
      if (genderIds) scopes.push({ method: ['byGenderId', (genderIds as string).split(',')] });
      if (productTypeIds) scopes.push({ method: ['byProductTypeId', (productTypeIds as string).split(',')] });
      if (priceFrom || priceTo) scopes.push({ method: ['byPriceRange', priceFrom, priceTo] });
      if (freeWord) scopes.push({ method: ['byFreeWord', freeWord] });
      if (colorIds) scopes.push({ method: ['byColor', (colorIds as string).split(',')] });
      if (sizeIds) scopes.push({ method: ['bySize', (sizeIds as string).split(',')] });
      if (currentUser) scopes.push({ method: ['isFavorite', currentUser.id] });
      if (priceOrder) orderConditions.push([Sequelize.literal('price'), priceOrder]);
      if (createdAtOrder) orderConditions.push([Sequelize.literal('createdAt'), createdAtOrder]);
      scopes.push({ method: ['bySorting', orderConditions] });
      const { count, rows } = await ProductModel.scope(scopes).findAndCountAll({
        limit,
        offset,
        distinct: true,
        col: 'ProductModel.id',
      });
      sendSuccess(res, { products: rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const product = await ProductModel.scope([
        { method: ['byId', req.params.productId] },
        'withCollections',
        'withCategories',
        'withProductType',
        'withGender',
        'withPriceRange',
        'isActive',
      ]).findOne();
      if (!product) {
        return sendError(res, 404, NoData);
      }
      const options = await ProductOptionModel.scope([
        { method: ['byProductId', product.id] },
        'withValueName',
      ]).findAll();
      product.setDataValue('options', options);
      product.setDataValue('medias', await product.getMedias());
      product.setDataValue('variants', await product.getVariantDetail());
      sendSuccess(res, { product });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async verifyProduct (req: Request, res: Response) {
    try {
      const { sku } = req.query;
      const product = await ProductModel.scope([
        { method: ['verifyProduct', sku] },
        'isActive',
        'withThumbnail',
      ]).findOne();
      if (!product) { return sendError(res, 404, NoData); }
      sendSuccess(res, product);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new ProductController();
