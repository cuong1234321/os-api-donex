import settings from '@configs/settings';
import { sendError, sendSuccess } from '@libs/response';
import NewsModel from '@models/news';
import ProductCategoryModel from '@models/productCategories';
import ProductModel from '@models/products';
import { Request, Response } from 'express';

class HomepageController {
  public async index (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      const categories = await ProductCategoryModel.scope([
        'notChildren',
        { method: ['byType', ProductCategoryModel.TYPE_ENUM.NONE] },
      ]).findAll();
      const product = await this.homepageProduct(currentUser);
      const news = await this.homepageNews();
      sendSuccess(res, { categories, product, news });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  private async homepageProduct (currentUser: any) {
    const scopeFlashSale: any = [
      'withPrice',
      'withThumbnail',
      'isActive',
      'isFlashSale',
    ];
    const scopeNew: any = [
      'withPrice',
      'withThumbnail',
      'isActive',
      'newest',
    ];
    const scopeHighlight: any = [
      'withPrice',
      'withThumbnail',
      'isActive',
      'isHighlight',
    ];
    if (currentUser) {
      scopeFlashSale.push({ method: ['isFavorite', currentUser.id] });
      scopeNew.push({ method: ['isFavorite', currentUser.id] });
      scopeHighlight.push({ method: ['isFavorite', currentUser.id] });
    }
    const flashSaleProducts = await ProductModel.scope(scopeFlashSale).findAll({ limit: parseInt(settings.defaultPerPage) });
    const newProducts = await ProductModel.scope(scopeNew).findAll({ limit: parseInt(settings.defaultPerPage) });
    const highLightProducts = await ProductModel.scope(scopeHighlight).findAll({ limit: parseInt(settings.defaultPerPage) });
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
