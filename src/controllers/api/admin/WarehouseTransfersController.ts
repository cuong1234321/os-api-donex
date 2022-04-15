import { sendSuccess, sendError } from '@libs/response';
import { Request, Response } from 'express';
import sequelize from '@initializers/sequelize';
import { Transaction } from 'sequelize/types';
import settings from '@configs/settings';
import WarehouseTransferModel from '@models/warehouseTransfers';
import WarehouseTransferVariantModel from '@models/warehouseTransferVariants';

class WarehouseTransferController {
  public async create (req: Request, res: Response) {
    try {
      const currentAdmin = req.currentAdmin || { id: 1 };
      const params = req.parameters.permit(WarehouseTransferModel.CREATABLE_PARAMETERS).value();
      params.adminId = currentAdmin.id;
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const warehouseTransfer = await WarehouseTransferModel.create(params, {
          include: [
            { model: WarehouseTransferVariantModel, as: 'warehouseTransferVariants' },
          ],
          transaction,
        });
        return warehouseTransfer;
      });
      sendSuccess(res, { warehouseTransfer: result });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.size as string || settings.defaultPerPage, 10);
      const offset = (page - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { fromDate, toDate } = req.query;
      const scopes: any = [
        'withWarehouseName',
        'withAdminName',
        { method: ['byDate', fromDate, toDate] },
        { method: ['bySorting', sortBy, sortOrder] },
      ];
      const { rows, count } = await WarehouseTransferModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { warehouseTransfers: rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new WarehouseTransferController();
