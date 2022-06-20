import settings from '@configs/settings';
import { sendError, sendSuccess } from '@libs/response';
import WarehouseVariantModel from '@models/warehouseVariants';
import XlsxService from '@services/xlsx';
import dayjs from 'dayjs';
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

  public async download (req: Request, res: Response) {
    try {
      const time = dayjs().format('DDMMYYhhmmss');
      const fileName = `Bao-cao-doanh-thu-kho-hang-${time}.xlsx`;
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
      const warehouseReports = await WarehouseVariantModel.scope(scopes).findAll();
      const buffer: any = await XlsxService.downloadWarehouseReports(warehouseReports);
      res.writeHead(200, [
        ['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        ['Content-Disposition', 'attachment; filename=' + `${fileName}`],
      ]);
      res.end(Buffer.from(buffer, 'base64'));
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}
export default new WarehouseReportController();
