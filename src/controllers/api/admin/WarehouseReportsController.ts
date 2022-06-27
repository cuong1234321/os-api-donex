import settings from '@configs/settings';
import { sendError, sendSuccess } from '@libs/response';
import ProductVariantModel from '@models/productVariants';
import WarehouseVariantModel from '@models/warehouseVariants';
import XlsxService from '@services/xlsx';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';

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

  public async inventoryReport (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.size as string || settings.defaultPerPage, 10);
      const offset = (page - 1) * limit;
      const { warehouseId } = req.params;
      const { freeWord, categoryId } = req.query;
      const mainScope: any = [
        'withOptions',
        'withUnit',
        'withProductName',
        { method: ['withQuantityByMainSku', warehouseId] },
        { method: ['byWarehouse', warehouseId] },
      ];
      if (freeWord) {
        mainScope.push({ method: ['byFreeWord', freeWord] });
      }
      if (categoryId) {
        mainScope.push({ method: ['byCategory', categoryId] });
      }
      const { rows, count } = await ProductVariantModel.scope(mainScope).findAndCountAll({
        limit,
        offset,
        group: Sequelize.col('ProductVariantModel.mainSku'),
      });
      const mainSkus = rows.map((record) => record.mainSku);
      const detailScope: any = [
        { method: ['byMainSku', mainSkus] },
        { method: ['withQuantity', warehouseId] },
        'withOptions',
        { method: ['byWarehouse', warehouseId] },
      ];
      if (freeWord) {
        detailScope.push({ method: ['byFreeWord', freeWord] });
      }
      if (categoryId) {
        detailScope.push({ method: ['byCategory', categoryId] });
      }
      const variants = await ProductVariantModel.scope(detailScope).findAll();
      rows.forEach((row) => {
        const detailReport = variants.filter((record) => record.mainSku === row.mainSku);
        row.setDataValue('detailReport', detailReport);
      });
      sendSuccess(res, { variants: rows, pagination: { total: count.length, page, perpage: limit } });
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
