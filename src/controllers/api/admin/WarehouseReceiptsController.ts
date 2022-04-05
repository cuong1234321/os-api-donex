import { sendSuccess, sendError } from '@libs/response';
import WarehouseReceiptModel from '@models/warehouseReceipts';
import { Request, Response } from 'express';
import sequelize from '@initializers/sequelize';
import { Transaction } from 'sequelize/types';
import WarehouseReceiptVariantModel from '@models/warehouseReceiptVariants';
import settings from '@configs/settings';

class WarehouseReceiptController {
  public async create (req: Request, res: Response) {
    try {
      const currentAdmin = req.currentAdmin || { id: 1 };
      const params = req.parameters.permit(WarehouseReceiptModel.CREATABLE_PARAMETERS).value();
      params.adminId = currentAdmin.id;
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const warehouse = await WarehouseReceiptModel.create(params, {
          include: [
            { model: WarehouseReceiptVariantModel, as: 'warehouseReceiptVariants' },
          ],
          transaction,
        });
        return warehouse;
      });
      sendSuccess(res, { warehouseReceipt: result });
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
      const scopes: any = [
        'newest',
        'withImportAbleName',
        'withAdminName',
        { method: ['byDate', fromDate, toDate] },
      ];
      if (type) scopes.push({ method: ['byType', type] });
      const { rows, count } = await WarehouseReceiptModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { warehouseReceipt: rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new WarehouseReceiptController();
