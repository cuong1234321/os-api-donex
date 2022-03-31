import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import ProductVariantModel from '@models/productVariants';

class ProductVariantController {
  public async index (req: Request, res: Response) {
    try {
      const { category, productId } = req.query;
      const orderConditions: any = [];
      const scopes: any = [
        'withOptions',
      ];
      if (category) scopes.push({ method: ['byCategory', category] });
      if (productId) scopes.push({ method: ['byProduct', productId] });
      scopes.push({ method: ['bySortOrder', orderConditions] });
      const variants = await ProductVariantModel.scope(scopes).findAll();
      sendSuccess(res, variants);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new ProductVariantController();
