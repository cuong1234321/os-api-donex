import { sendSuccess, sendError } from '@libs/response';
import WarehouseExportModel from '@models/warehouseExports';
import WarehouseExportVariantModel from '@models/warehouseExportVariants';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import sequelize from '@initializers/sequelize';
import settings from '@configs/settings';

class WarehouseExportController {
  public async create (req: Request, res: Response) {
    try {
      const currentAdmin = req.currentAdmin || { id: 1 };
      const params = req.parameters.permit(WarehouseExportModel.CREATABLE_PARAMETERS).value();
      params.adminId = currentAdmin.id;
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const warehouseExport = await WarehouseExportModel.create(params, {
          include: [
            { model: WarehouseExportVariantModel, as: 'warehouseExportVariants' },
          ],
          transaction,
        });
        return warehouseExport;
      });
      sendSuccess(res, { warehouseExport: result });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.size as string || settings.defaultPerPage, 10);
      const offset = (page - 1) * limit;
      const { fromDate, toDate, type } = req.query;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        'withExportAbleName',
        'withAdminName',
        'withTotalPrice',
        { method: ['byDate', fromDate, toDate] },
      ];
      if (type) scopes.push({ method: ['byType', type] });
      const { rows, count } = await WarehouseExportModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { warehouseReceipts: rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new WarehouseExportController();
