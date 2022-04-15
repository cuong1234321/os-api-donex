import settings from '@configs/settings';
import { sendError, sendSuccess } from '@libs/response';
import WarehouseVariantModel from '@models/warehouseVariants';
import { Request, Response } from 'express';

class WarehouseReportController {
  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.size as string || settings.defaultPerPage, 10);
      const offset = (page - 1) * limit;
      const { fromDate, toDate, warehouseId, productCategoryId, freeWord } = req.query;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        'withVariantDetail',
        'withWarehouse',
        { method: ['byQuantityDetail', fromDate, toDate] },
        { method: ['bySorting', sortBy, sortOrder] },
      ];
      if (warehouseId) scopes.push({ method: ['byWarehouseId', warehouseId] });
      if (productCategoryId) scopes.push({ method: ['byProuctCategoryId', productCategoryId] });
      if (freeWord) scopes.push({ method: ['byFreeWord', freeWord] });
      const { rows, count } = await WarehouseVariantModel.scope(scopes).findAndCountAll({
        limit,
        offset,
        distinct: true,
        col: 'WarehouseVariantModel.id',
      });
      sendSuccess(res, { warehouseReports: rows, pagination: { total: count, page, perpage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}
export default new WarehouseReportController();
