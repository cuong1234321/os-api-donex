import { sendSuccess, sendError } from '@libs/response';
import { Request, Response } from 'express';
import sequelize from '@initializers/sequelize';
import { Transaction } from 'sequelize/types';
import settings from '@configs/settings';
import WarehouseTransferModel from '@models/warehouseTransfers';
import WarehouseTransferVariantModel from '@models/warehouseTransferVariants';
import { NoData } from '@libs/errors';
import XlsxService from '@services/xlsx';
import dayjs from 'dayjs';
import _ from 'lodash';
import ProductVariantModel from '@models/productVariants';
import { Sequelize } from 'sequelize';

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
      const productVariants = await this.getProductVariantGroupByMainSku(warehouseTransfer);
      warehouseTransfer.setDataValue('productVariantGroupByMainSku', productVariants);
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
      const { fromDate, toDate, status } = req.query;
      const scopes: any = [
        'withWarehouseName',
        'withAdminName',
        { method: ['byDate', fromDate, toDate] },
        { method: ['bySorting', sortBy, sortOrder] },
      ];
      if (status) scopes.push({ method: ['byStatus', status] });
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

  public async download (req: Request, res: Response) {
    try {
      const time = dayjs().format('DD-MM-YY-hh:mm:ss');
      const fileName = `Bao-cao-chuyen-kho-${time}.xlsx`;
      const { warehouseTransferId } = req.params;
      const scopes: any = [
        { method: ['byId', warehouseTransferId] },
        'withTotalPrice',
        'withTotalQuantity',
        'withWarehouseName',
      ];
      const warehouseTransfer = await WarehouseTransferModel.scope(scopes).findOne();
      if (!warehouseTransfer) { return sendError(res, 404, NoData); }
      const productVariants = await this.getProductVariantGroupByMainSku(warehouseTransfer);
      const buffer: any = await XlsxService.downloadWarehouseTransfer(warehouseTransfer, productVariants);
      res.writeHead(200, [
        ['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        ['Content-Disposition', 'attachment; filename=' + `${fileName}`],
      ]);
      res.end(Buffer.from(buffer, 'base64'));
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  private async getProductVariantGroupByMainSku (warehouseTransfer: WarehouseTransferModel) {
    const warehouseTransferVariants = await WarehouseTransferVariantModel.scope([
      { method: ['byWarehouseTransfer', warehouseTransfer.id] },
      'withMainSkuVariant',
      'withOptions',
    ]).findAll();
    const variantIds = _.map(warehouseTransferVariants, 'variantId');
    const productVariants = await ProductVariantModel.scope([
      { method: ['byId', variantIds] },
      'withOptions',
      'withUnit',
      'withProductName',
    ]).findAll({
      group: Sequelize.col('ProductVariantModel.mainSku'),
    });
    productVariants.forEach(variant => {
      const quantityByEachSize: any = {};
      const sizeSVariants = warehouseTransferVariants.filter(record => record.getDataValue('mainSku') === variant.mainSku && ['S', '38'].includes(record.getDataValue('sizeTitle')));
      const sizeMVariants = warehouseTransferVariants.filter(record => record.getDataValue('mainSku') === variant.mainSku && ['M', '6', '39'].includes(record.getDataValue('sizeTitle')));
      const sizeLVariants = warehouseTransferVariants.filter(record => record.getDataValue('mainSku') === variant.mainSku && ['L', '8', '40'].includes(record.getDataValue('sizeTitle')));
      const sizeXLVariants = warehouseTransferVariants.filter(record => record.getDataValue('mainSku') === variant.mainSku && ['XL', '10', '41'].includes(record.getDataValue('sizeTitle')));
      const size2XLVariants = warehouseTransferVariants.filter(record => record.getDataValue('mainSku') === variant.mainSku && ['2XL', '12', '42'].includes(record.getDataValue('sizeTitle')));
      const size3XLVariants = warehouseTransferVariants.filter(record => record.getDataValue('mainSku') === variant.mainSku && ['3XL', '14', '43'].includes(record.getDataValue('sizeTitle')));
      quantityByEachSize.S = _.sumBy(sizeSVariants, 'quantity');
      quantityByEachSize.M = _.sumBy(sizeMVariants, 'quantity');
      quantityByEachSize.L = _.sumBy(sizeLVariants, 'quantity');
      quantityByEachSize.XL = _.sumBy(sizeXLVariants, 'quantity');
      quantityByEachSize.XXL = _.sumBy(size2XLVariants, 'quantity');
      quantityByEachSize.XXXL = _.sumBy(size3XLVariants, 'quantity');
      quantityByEachSize.totalQuantity = quantityByEachSize.S + quantityByEachSize.M + quantityByEachSize.L + quantityByEachSize.XL + quantityByEachSize.XXL + quantityByEachSize.XXXL;
      variant.setDataValue('quantityBySizes', quantityByEachSize);
    });
    return productVariants;
  }
}

export default new WarehouseTransferController();
