import settings from '@configs/settings';
import { sendError, sendSuccess } from '@libs/response';
import ProductCategoryModel from '@models/productCategories';
import ProductModel from '@models/products';
import { Request, Response } from 'express';

class HomepageController {
  public async index (req: Request, res: Response) {
    try {
      const categories = await ProductCategoryModel.scope([
        'notChildren',
        { method: ['byType', ProductCategoryModel.TYPE_ENUM.NONE] },
      ]).findAll();
      const product = await this.HomepageProduct();
      sendSuccess(res, { categories, product });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  private async HomepageProduct () {
    const flashSaleProducts = await ProductModel.scope([
      'withPrice',
      'withThumbnail',
      'isActive',
      'isFlashSale',
    ]).findAll({ limit: parseInt(settings.defaultPerPage) });
    const newProducts = await ProductModel.scope([
      'withPrice',
      'withThumbnail',
      'isActive',
      'newest',
    ]).findAll({ limit: parseInt(settings.defaultPerPage) });
    const highLightProducts = await ProductModel.scope([
      'withPrice',
      'withThumbnail',
      'isActive',
      'isHighlight',
    ]).findAll({ limit: parseInt(settings.defaultPerPage) });
    return { flashSaleProducts, newProducts, highLightProducts };
  }
}

export default new HomepageController();
