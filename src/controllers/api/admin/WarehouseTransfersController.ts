import { sendSuccess, sendError } from '@libs/response';
import { Request, Response } from 'express';
import sequelize from '@initializers/sequelize';
import { Transaction } from 'sequelize/types';
import settings from '@configs/settings';
import WarehouseTransferModel from '@models/warehouseTransfers';
import WarehouseTransferVariantModel from '@models/warehouseTransferVariants';
import { NoData } from '@libs/errors';

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

  public async show (req: Request, res: Response) {
    try {
      const { warehouseTransferId } = req.params;
      const scopes: any = [
        { method: ['byId', warehouseTransferId] },
        'withTotalPrice',
        'withTotalQuantity',
        'withWarehouseName',
      ];
      const warehouseTransfer = await WarehouseTransferModel.scope(scopes).findOne();
      if (!warehouseTransfer) { return sendError(res, 404, NoData); }
      await warehouseTransfer.reloadWithDetail();
      sendSuccess(res, warehouseTransfer);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const { warehouseTransferId } = req.params;
      const warehouseTransfer = await WarehouseTransferModel.scope([
        { method: ['byId', warehouseTransferId] },
        { method: ['byStatus', WarehouseTransferModel.STATUS_ENUM.PENDING] },
      ]).findOne();
      if (!warehouseTransfer) { return sendError(res, 404, NoData); }
      const params = req.parameters.permit(WarehouseTransferModel.UPDATABLE_PARAMETERS).value();
      await sequelize.transaction(async (transaction: Transaction) => {
        await warehouseTransfer.update(params, { transaction });
        await warehouseTransfer.updateTransferVariants(params.warehouseTransferVariants, transaction);
      });
      await warehouseTransfer.reloadWithDetail();
      sendSuccess(res, warehouseTransfer);
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

  public async changeStatus (req: Request, res: Response) {
    try {
      const { warehouseTransferId } = req.params;
      const warehouseTransfer = await WarehouseTransferModel.scope([
        { method: ['byId', warehouseTransferId] },
        { method: ['byStatus', WarehouseTransferModel.STATUS_ENUM.PENDING] },
      ]).findOne();
      if (!warehouseTransfer) { return sendError(res, 404, NoData); }
      const params = req.body;
      await warehouseTransfer.update(params);
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new WarehouseTransferController();