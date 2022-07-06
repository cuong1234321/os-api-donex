import settings from '@configs/settings';
import { sendError, sendSuccess } from '@libs/response';
import OrderItemModel from '@models/orderItems';
import OrderModel from '@models/orders';
import ProductVariantModel from '@models/productVariants';
import UserModel from '@models/users';
import WarehouseReceiptModel from '@models/warehouseReceipts';
import WarehouseReceiptVariantModel from '@models/warehouseReceiptVariants';
import { Request, Response } from 'express';

class ReportController {
  public async reportVariants (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const { freeWord, fromDate, toDate } = req.query;
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        { method: ['bySortOrder', sortBy, sortOrder] },
        'withBuyerName',
        'withProductUnit',
        'withSubOrderFinish',
      ];
      if (freeWord) { scopes.push({ method: ['byFreeWord', freeWord] }); }
      if (fromDate && toDate) { scopes.push({ method: ['byCreatedAt', fromDate, toDate] }); }
      const { rows, count } = await OrderItemModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async reportUsers (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const { freeWord, fromDate, toDate } = req.query;
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'totalSubOrder';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        { method: ['withTotalSubOrder', fromDate, toDate] },
      ];
      if (freeWord) { scopes.push({ method: ['byFreeWord', freeWord] }); }
      const { rows, count } = await UserModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async reportVariantSale (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const { freeWord, fromDate, toDate, categoryId } = req.query;
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'totalSale';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        'withTotalSale',
      ];
      if (categoryId) { scopes.push({ method: ['byCategory', categoryId] }); }
      if (freeWord) { scopes.push({ method: ['byFreeWord', freeWord] }); }
      if (fromDate && toDate) { scopes.push({ method: ['byCreatedAt', fromDate, toDate] }); }
      const { rows, count } = await ProductVariantModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async reportUsedCoinReward (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const { freeWord, fromDate, toDate } = req.query;
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'coinUsed';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        { method: ['bySortOrder', sortBy, sortOrder] },
        'withOwner',
      ];
      if (freeWord) { scopes.push({ method: ['withOwner', freeWord] }); }
      if (fromDate && toDate) { scopes.push({ method: ['byCreatedAt', fromDate, toDate] }); }
      const { rows, count } = await OrderModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async returnedOder (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const { freeWord, fromDate, toDate } = req.query;
      const limit = parseInt(req.query.size as string || settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const warehouseReceipts = await WarehouseReceiptModel.scope([
        'isReturnOrder',
      ]).findAll({ attributes: ['id'] });
      const scopes: any = [
        'withVariantDetail',
        'withSubOrder',
        { method: ['byWarehouseReceipt', warehouseReceipts.map(record => record.id)] },
        { method: ['byDate', fromDate, toDate] },
        { method: ['bySortOrder', sortBy, sortOrder] },
      ];
      if (freeWord) {
        scopes.push({ method: ['byFreeWord', freeWord] });
      }
      const { rows, count } = await WarehouseReceiptVariantModel.scope(scopes).findAndCountAll({ limit, offset, distinct: true, col: 'WarehouseReceiptVariantModel.id' });
      sendSuccess(res, { orderItems: rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new ReportController();
