import { MissingImportFile, NoData } from '@libs/errors';
import { sendSuccess, sendError } from '@libs/response';
import WarehouseReceiptModel from '@models/warehouseReceipts';
import { Request, Response } from 'express';
import sequelize from '@initializers/sequelize';
import { Transaction } from 'sequelize/types';
import WarehouseReceiptVariantModel from '@models/warehouseReceiptVariants';
import settings from '@configs/settings';
import XlsxService from '@services/xlsx';
import dayjs from 'dayjs';
import WarehouseReceiptImporterService from '@services/warehouseReceiptImporter';
import SubOrderModel from '@models/subOrders';
import CoinWalletChangeModel from '@models/coinWalletChanges';
import SystemSettingModel from '@models/systemSetting';
import _ from 'lodash';

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
        if (warehouse.type === WarehouseReceiptModel.TYPE_ENUM.ORDER_REFUND) {
          const subtractCoinWalletChange = await this.subtractCoin(warehouse.getDataValue('warehouseReceiptVariants'), warehouse.orderId);
          const addCoinWalletChange = await this.addCoin(warehouse.getDataValue('warehouseReceiptVariants'), warehouse.orderId);
          if (subtractCoinWalletChange?.amount && subtractCoinWalletChange.amount < 0) {
            await CoinWalletChangeModel.create(subtractCoinWalletChange, { transaction });
          }
          if (addCoinWalletChange?.amount && addCoinWalletChange.amount > 0) {
            await CoinWalletChangeModel.create(addCoinWalletChange, { transaction });
          }
        }
        return warehouse;
      });
      sendSuccess(res, { warehouseReceipt: result });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const { warehouseReceiptId } = req.params;
      const scopes: any = [
        { method: ['byId', (warehouseReceiptId as string).split(',')] },
        'withImportAbleName',
        'withTotalPrice',
        'withTotalQuantity',
      ];
      const warehouseReceipt = await WarehouseReceiptModel.scope(scopes).findAll();
      if (warehouseReceipt.length === 0) { return sendError(res, 404, NoData); }
      if (!warehouseReceipt) { return sendError(res, 404, NoData); }
      for (const record of warehouseReceipt) {
        await record.reloadWithDetail();
      }
      sendSuccess(res, warehouseReceipt);
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
        'withTotalPrice',
        { method: ['byDate', fromDate, toDate] },
      ];
      if (type) scopes.push({ method: ['byType', type] });
      const { rows, count } = await WarehouseReceiptModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { warehouseReceipt: rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const { warehouseReceiptId } = req.params;
      const warehouseReceipt = await WarehouseReceiptModel.findByPk(warehouseReceiptId);
      if (!warehouseReceipt) { return sendError(res, 404, NoData); }
      const params = req.parameters.permit(WarehouseReceiptModel.UPDATABLE_PARAMETERS).value();
      await sequelize.transaction(async (transaction: Transaction) => {
        await warehouseReceipt.update(params, { transaction });
        await warehouseReceipt.updateReceiptVariants(params.warehouseReceiptVariants, transaction);
      });
      await warehouseReceipt.reloadWithDetail();
      sendSuccess(res, warehouseReceipt);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async download (req: Request, res: Response) {
    try {
      const time = dayjs().format('DD-MM-YY-hh:mm:ss');
      const fileName = `Bao-cao-nhap-kho-${time}.xlsx`;
      const { warehouseReceiptId } = req.params;
      const scopes: any = [
        { method: ['byId', warehouseReceiptId] },
        'withImportAbleName',
        'withTotalPrice',
        'withTotalQuantity',
      ];
      const warehouseReceipt = await WarehouseReceiptModel.scope(scopes).findOne();
      if (!warehouseReceipt) { return sendError(res, 404, NoData); }
      await warehouseReceipt.reloadWithDetail();
      const buffer: any = await XlsxService.downloadWarehouseReceipt(warehouseReceipt);
      res.writeHead(200, [
        ['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        ['Content-Disposition', 'attachment; filename=' + `${fileName}`],
      ]);
      res.end(Buffer.from(buffer, 'base64'));
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async downloadList (req: Request, res: Response) {
    try {
      const time = dayjs().format('DD-MM-YY-hh:mm:ss');
      const fileName = `Bao-cao-danh-sach-nhap-kho-${time}.xlsx`;
      const { warehouseReceiptIds, fromDate, toDate, type } = req.query;
      const scopes: any = [
        'newest',
        'withImportAbleName',
        'withAdminName',
        'withTotalPrice',
      ];
      if (warehouseReceiptIds) scopes.push({ method: ['byId', (warehouseReceiptIds as string).split(',')] });
      if (type) scopes.push({ method: ['byType', type] });
      if (!fromDate && !toDate) {
        scopes.push({ method: ['byDate', dayjs().subtract(30, 'day').format('YYYY/MM/DD'), dayjs().format('YYYY/MM/DD')] });
      }
      if (fromDate && toDate) {
        scopes.push({ method: ['byDate', fromDate, toDate] });
      }
      const warehouseReceipts = await WarehouseReceiptModel.scope(scopes).findAll();
      const buffer: any = await XlsxService.downloadListWarehouseReceipts(warehouseReceipts);
      res.writeHead(200, [
        ['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        ['Content-Disposition', 'attachment; filename=' + `${fileName}`],
      ]);
      res.end(Buffer.from(buffer, 'base64'));
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async upload (req: Request, res: Response) {
    try {
      const file = req.file;
      if (file.originalname.split('.').reverse()[0] !== 'xlsx') {
        sendError(res, 400, MissingImportFile);
      }
      const warehouseReceiptImporter = new WarehouseReceiptImporterService(file);
      const warehouseReceipts = await warehouseReceiptImporter.executeImport();
      sendSuccess(res, { warehouseReceipts });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async downloadTemplate (req: Request, res: Response) {
    try {
      const file = 'public/Nhap-kho.xlsx';
      res.download(file, 'Form tải lên nhập kho (Mẫu).xlsx');
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  private async subtractCoin (warehouseReceiptVariants: WarehouseReceiptVariantModel[], subOrderId: number) {
    const subOrder = await SubOrderModel.findByPk(subOrderId);
    const order = await subOrder.getOrder();
    if (!order.orderableId) { return; }
    const orderItems = (await subOrder.getItems()).filter((record) => record.saleCampaignDiscount === 0);
    if (orderItems.length > 0) {
      const systemSetting: any = (await SystemSettingModel.findOrCreate({
        where: { },
        defaults: { id: undefined },
      }))[0];
      let totalPrice = 0;
      warehouseReceiptVariants.forEach(warehouseReceiptVariant => {
        const orderItem = orderItems.find((record) => record.productVariantId === warehouseReceiptVariant.variantId);
        totalPrice += orderItem.listedPrice * warehouseReceiptVariant.quantity;
      });
      const params: any = {
        id: undefined,
        userId: order.orderableId,
        type: CoinWalletChangeModel.TYPE_ENUM.SUBTRACT,
        mutableType: CoinWalletChangeModel.MUTABLE_TYPE.ORDER,
        mutableId: subOrder.id,
        amount: 0 - Math.round(totalPrice * systemSetting.coinFinishOrder / 100),
      };
      return params;
    }
  }

  private async addCoin (warehouseReceiptVariants: WarehouseReceiptVariantModel[], subOrderId: number) {
    const subOrder = await SubOrderModel.findByPk(subOrderId);
    const order = await subOrder.getOrder();
    if (!order.orderableId) { return; }
    const totalPrice = _.sumBy(warehouseReceiptVariants, (record) => record.totalPrice);
    const systemSetting: any = (await SystemSettingModel.findOrCreate({
      where: { },
      defaults: { id: undefined },
    }))[0];
    const params: any = {
      id: undefined,
      userId: order.orderableId,
      type: CoinWalletChangeModel.TYPE_ENUM.ADD,
      mutableType: CoinWalletChangeModel.MUTABLE_TYPE.ORDER_REFUND,
      mutableId: subOrder.id,
      amount: Math.round(totalPrice / (systemSetting.coinConversionLevel || 1000)),
    };
    return params;
  }
}

export default new WarehouseReceiptController();
