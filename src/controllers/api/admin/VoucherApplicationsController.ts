import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import sequelize from '@initializers/sequelize';
import { Transaction } from 'sequelize';
import { NoData } from '@libs/errors';
import ImageUploaderService from '@services/imageUploader';
import Settings from '@configs/settings';
import VoucherConditionModel from '@models/voucherConditions';
import VoucherApplicationModel from '@models/voucherApplications';

class VoucherApplicationController {
  public async index (req: Request, res: Response) {
    try {
      const { freeWord, paymentMethod, status, dateFrom, dateTo } = req.query;
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(Settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        { method: ['byDate', dateFrom, dateTo] },
      ];
      if (freeWord) { scopes.push({ method: ['byFreeWord', freeWord] }); }
      if (paymentMethod) { scopes.push({ method: ['byPaymentMethod', paymentMethod] }); }
      if (status) { scopes.push({ method: ['byStatus', status] }); }
      const { count, rows } = await VoucherApplicationModel.scope(scopes).findAndCountAll({
        limit,
        offset,
        distinct: true,
        col: 'VoucherApplicationModel.id',
      });
      sendSuccess(res, { vouchers: rows, pagination: { total: count, page, perPage: limit, offset } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const voucher = await VoucherApplicationModel.scope([
        { method: ['byId', req.params.voucherApplicationId] },
        'withConditions',
        'withUserVouchers',
        'withCollaboratorVouchers',
      ]).findOne();
      if (!voucher) return sendError(res, 404, NoData);
      sendSuccess(res, { voucher });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const currentAdmin = req.currentAdmin || { id: 1 };
      const params = req.parameters.permit(VoucherApplicationModel.CREATABLE_PARAMETERS).value();
      params.adminId = currentAdmin.id;
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const voucher = await VoucherApplicationModel.create(params, {
          include: [
            { model: VoucherConditionModel, as: 'conditions' },
          ],
          transaction,
        });
        return voucher;
      });
      sendSuccess(res, { voucher: result });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const voucher = await VoucherApplicationModel.findByPk(req.params.voucherApplicationId);
      if (!voucher) return sendError(res, 404, NoData);
      const params = req.parameters.permit(VoucherApplicationModel.UPDATABLE_PARAMETERS).value();
      await sequelize.transaction(async (transaction: Transaction) => {
        await voucher.update(params, { transaction });
        await voucher.updateConditions(params.conditions, transaction);
      });
      await voucher.reload({ include: [{ model: VoucherConditionModel, as: 'conditions' }] });
      sendSuccess(res, { voucher });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadThumbnail (req: Request, res: Response) {
    try {
      const voucher = await VoucherApplicationModel.findByPk(req.params.voucherApplicationId);
      if (!voucher) return sendError(res, 404, NoData);
      const thumbnail = await ImageUploaderService.singleUpload(req.file);
      await voucher.update({ thumbnail }, { validate: false });
      sendSuccess(res, { voucher });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async active (req: Request, res: Response) {
    try {
      const voucher = await VoucherApplicationModel.findByPk(req.params.voucherApplicationId);
      if (!voucher) return sendError(res, 404, NoData);
      await voucher.update({ status: VoucherApplicationModel.STATUS_ENUM.ACTIVE }, { validate: false });
      sendSuccess(res, { voucher });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async inactive (req: Request, res: Response) {
    try {
      const voucher = await VoucherApplicationModel.findByPk(req.params.voucherApplicationId);
      if (!voucher) return sendError(res, 404, NoData);
      await voucher.update({ status: VoucherApplicationModel.STATUS_ENUM.INACTIVE }, { validate: false });
      sendSuccess(res, { voucher });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const voucher = await VoucherApplicationModel.scope([
        { method: ['byId', req.params.voucherApplicationId] },
        'isRunning',
      ]).findOne();
      if (!voucher) return sendError(res, 404, NoData);
      voucher.destroy();
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new VoucherApplicationController();
