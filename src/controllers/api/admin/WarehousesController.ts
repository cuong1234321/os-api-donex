import Settings from '@configs/settings';
import { existProduct, NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import WarehouseModel from '@models/warehouses';
import { Request, Response } from 'express';

class WarehouseController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(WarehouseModel.CREATABLE_PARAMETERS).value();
      const warehouse = await WarehouseModel.create(params);
      sendSuccess(res, warehouse);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const { warehouseId } = req.params;
      const warehouse = await WarehouseModel.findByPk(warehouseId);
      if (!warehouse) { return sendError(res, 404, NoData); }
      const params = req.parameters.permit(WarehouseModel.UPDATABLE_PARAMETERS).value();
      await warehouse.update(params);
      sendSuccess(res, warehouse);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.size as string || Settings.defaultPerPage, 10);
      const offset = (page - 1) * limit;
      const { freeWord, type, status } = req.query;
      const scopes: any = ['newest', 'withAddress'];
      if (freeWord) { scopes.push({ method: ['byFreeWord', freeWord] }); }
      if (type) { scopes.push({ method: ['byType', type] }); }
      if (status) { scopes.push({ method: ['byStatus', status] }); }
      const { rows, count } = await WarehouseModel.scope(scopes).findAndCountAll({
        limit,
        offset,
      });
      sendSuccess(res, { warehouses: rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const { warehouseId } = req.params;
      const warehouse = await WarehouseModel.scope([
        { method: ['byId', warehouseId] },
        'totalQuantity',
        'withWarehouseVariantDetail',
      ]).findOne();
      if (!warehouse) { return sendError(res, 404, NoData); }
      sendSuccess(res, warehouse);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const { warehouseId } = req.params;
      const warehouse = await WarehouseModel.scope([
        { method: ['byId', warehouseId] },
      ]).findOne();
      if (!warehouse) { return sendError(res, 404, NoData); }
      if (!(await warehouse.checkDelete())) {
        return sendError(res, 404, existProduct);
      }
      await warehouse.destroy();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}
export default new WarehouseController();
