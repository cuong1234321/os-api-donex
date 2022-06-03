import settings from '@configs/settings';
import { sendError, sendSuccess } from '@libs/response';
import AdminModel from '@models/admins';
import CollaboratorModel from '@models/collaborators';
import WarehouseModel from '@models/warehouses';
import { Request, Response } from 'express';

class IncomeReportController {
  public async sellerIncome (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.size as string || settings.defaultPerPage);
      const offset = (page - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { fromDate, toDate, freeWord, discountFrom, discountTo, incomeFrom, incomeTo } = req.query;
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        { method: ['withTotalListedPrice', fromDate, toDate] },
        { method: ['withTotalDiscount', fromDate, toDate] },
      ];
      if (freeWord) scopes.push({ method: ['byFreeWord', freeWord] });
      if (incomeFrom && incomeTo) scopes.push({ method: ['byTotalListedPrice', incomeFrom, incomeTo, fromDate, toDate] });
      if (discountFrom && discountTo) scopes.push({ method: ['byTotalDiscount', discountFrom, discountTo, fromDate, toDate] });
      const { rows, count } = await CollaboratorModel.scope(scopes).findAndCountAll({ limit, offset, distinct: true, col: 'CollaboratorModel.id' });
      sendSuccess(res, { admins: rows, pagination: { total: count, page, perpage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async employeeIncome (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.size as string || settings.defaultPerPage);
      const offset = (page - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { fromDate, toDate, freeWord, quantityFrom, quantityTo, discountFrom, discountTo, incomeFrom, incomeTo } = req.query;
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        { method: ['withOrderQuantity', fromDate, toDate] },
        { method: ['withProductQuantity', fromDate, toDate] },
        { method: ['withTotalListedPrice', fromDate, toDate] },
        { method: ['withTotalDiscount', fromDate, toDate] },
      ];
      if (freeWord) scopes.push({ method: ['byFreeWord', freeWord] });
      if (quantityFrom && quantityTo) scopes.push({ method: ['byOrderQuantity', quantityFrom, quantityTo, fromDate, toDate] });
      if (incomeFrom && incomeTo) scopes.push({ method: ['byTotalListedPrice', incomeFrom, incomeTo, fromDate, toDate] });
      if (discountFrom && discountTo) scopes.push({ method: ['byTotalDiscount', discountFrom, discountTo, fromDate, toDate] });
      const { rows, count } = await AdminModel.scope(scopes).findAndCountAll({ limit, offset, distinct: true, col: 'AdminModel.id' });
      sendSuccess(res, { admins: rows, pagination: { total: count, page, perpage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async warehouseIncome (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.size as string || settings.defaultPerPage);
      const offset = (page - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { fromDate, toDate, quantityFrom, quantityTo, discountFrom, discountTo, incomeFrom, incomeTo } = req.query;
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        { method: ['withOrderQuantity', fromDate, toDate] },
        { method: ['withTotalListedPrice', fromDate, toDate] },
        { method: ['withTotalDiscount', fromDate, toDate] },
      ];
      if (quantityFrom && quantityTo) scopes.push({ method: ['byOrderQuantity', quantityFrom, quantityTo, fromDate, toDate] });
      if (discountFrom && discountTo) scopes.push({ method: ['byTotalDiscount', discountFrom, discountTo, fromDate, toDate] });
      if (incomeFrom && incomeTo) scopes.push({ method: ['byTotalListedPrice', incomeFrom, incomeTo, fromDate, toDate] });
      const { rows, count } = await WarehouseModel.scope(scopes).findAndCountAll({ limit, offset, distinct: true, col: 'WarehouseModel.id' });
      sendSuccess(res, { warehouses: rows, pagination: { total: count, page, perpage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}
export default new IncomeReportController();
