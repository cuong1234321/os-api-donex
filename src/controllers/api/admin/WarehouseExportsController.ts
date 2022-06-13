import { sendSuccess, sendError } from '@libs/response';
import WarehouseExportModel from '@models/warehouseExports';
import WarehouseExportVariantModel from '@models/warehouseExportVariants';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import sequelize from '@initializers/sequelize';
import settings from '@configs/settings';
import { NoData } from '@libs/errors';
import dayjs from 'dayjs';
import XlsxService from '@services/xlsx';

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

  public async show (req: Request, res: Response) {
    try {
      const { warehouseExportId } = req.params;
      const scopes: any = [
        { method: ['byId', (warehouseExportId as string).split(',')] },
        'withExportAbleName',
        'withTotalPrice',
        'withTotalQuantity',
      ];
      const warehouseExport = await WarehouseExportModel.scope(scopes).findAll();
      if (warehouseExport.length === 0) { return sendError(res, 404, NoData); }
      for (const record of warehouseExport) {
        await record.reloadWithDetail();
      }
      if (!warehouseExport) { return sendError(res, 404, NoData); }
      sendSuccess(res, warehouseExport);
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

  public async update (req: Request, res: Response) {
    try {
      const { warehouseExportId } = req.params;
      const warehouseExport = await WarehouseExportModel.findByPk(warehouseExportId);
      if (!warehouseExport) { return sendError(res, 404, NoData); }
      const params = req.parameters.permit(WarehouseExportModel.UPDATABLE_PARAMETERS).value();
      await sequelize.transaction(async (transaction: Transaction) => {
        await warehouseExport.update(params, { transaction });
        await warehouseExport.updateExportVariants(params.warehouseExportVariants, transaction);
      });
      await warehouseExport.reloadWithDetail();
      sendSuccess(res, warehouseExport);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async download (req: Request, res: Response) {
    try {
      const time = dayjs().format('DD-MM-YY-hh:mm:ss');
      const fileName = `Bao-cao-xuat-kho-${time}.xlsx`;
      const { warehouseExportId } = req.params;
      const scopes: any = [
        { method: ['byId', warehouseExportId] },
        'withExportAbleName',
        'withTotalPrice',
        'withTotalQuantity',
      ];
      const warehouseExport = await WarehouseExportModel.scope(scopes).findOne();
      if (!warehouseExport) { return sendError(res, 404, NoData); }
      await warehouseExport.reloadWithDetail();
      const buffer: any = await XlsxService.downloadWarehouseExport(warehouseExport);
      res.writeHead(200, [
        ['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        ['Content-Disposition', 'attachment; filename=' + `${fileName}`],
      ]);
      res.end(Buffer.from(buffer, 'base64'));
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async updateStatus (req: Request, res: Response) {
    try {
      const { warehouseExportId } = req.params;
      const status = req.body.status;
      const warehouseExport = await WarehouseExportModel.findByPk(warehouseExportId);
      if (!warehouseExport) { return sendError(res, 404, NoData); }
      await warehouseExport.update({ status });
      sendSuccess(res, warehouseExport);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async downloadList (req: Request, res: Response) {
    try {
      const time = dayjs().format('DD-MM-YY-hh:mm:ss');
      const fileName = `Bao-cao-danh-sach-xuat-kho-${time}.xlsx`;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { warehouseExportIds } = req.query;
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        'withExportAbleName',
        'withAdminName',
        'withTotalPrice',
      ];
      if (warehouseExportIds) scopes.push({ method: ['byId', (warehouseExportIds as string).split(',')] });
      const warehouseExports = await WarehouseExportModel.scope(scopes).findAll();
      const buffer: any = await XlsxService.downloadListWarehouseExports(warehouseExports);
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

export default new WarehouseExportController();
