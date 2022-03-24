import settings from '@configs/settings';
import { sendError, sendSuccess } from '@libs/response';
import NewsModel from '@models/news';
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
      const product = await this.homepageProduct();
      const news = await this.homepageNews();
      sendSuccess(res, { categories, product, news });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  private async homepageProduct () {
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

  private async homepageNews () {
    const news = await NewsModel.scope([
      { method: ['byStatus', NewsModel.STATUS_ENUM.ACTIVE] },
    ]).findAll({ limit: parseInt(settings.defaultPerPage) });
    return news;
  }
}

export default new HomepageController();
