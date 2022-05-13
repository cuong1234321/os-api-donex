import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import ProductModel from '@models/products';
import settings from '@configs/settings';
import { Sequelize } from 'sequelize';

class ProductController {
  public async index (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const scopes = this.listProductQueryBuilder(req);
      const { count, rows } = await ProductModel.scope(scopes).findAndCountAll({ limit, offset, distinct: true, col: 'ProductModel.id' });
      sendSuccess(res, { products: rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  private listProductQueryBuilder (req: Request) {
    const { sku, name, category, collectionId, unit, status, price, skuOrder, nameOrder, categoryOrder, priceOrder, statusOrder } = req.query;
    const orderConditions: any = [];
    const scopes: any = [
      'withCollections',
      'withCategories',
      { method: ['byStatus', ProductModel.STATUS_ENUM.ACTIVE] },
    ];
    if (sku) scopes.push({ method: ['bySkuCodeName', sku] });
    if (name) scopes.push({ method: ['byName', name] });
    if (category) { scopes.push({ method: ['byCategoryName', category] }); }
    if (collectionId) scopes.push({ method: ['byCollectionId', collectionId] });
    if (unit) scopes.push({ method: ['byUnit', unit] });
    if (price) scopes.push({ method: ['byPrice', parseInt(price as string)] });
    if (status) scopes.push({ method: ['byStatus', status] });
    if (skuOrder) orderConditions.push([Sequelize.literal('skuCode'), skuOrder]);
    if (nameOrder) orderConditions.push([Sequelize.literal('name'), nameOrder]);
    if (categoryOrder) orderConditions.push([Sequelize.literal('category'), categoryOrder]);
    if (priceOrder) orderConditions.push([Sequelize.literal('price'), priceOrder]);
    if (statusOrder) orderConditions.push([Sequelize.literal('status'), statusOrder]);
    scopes.push({ method: ['bySortOrder', orderConditions] });
    return scopes;
  }
}

export default new ProductController();
