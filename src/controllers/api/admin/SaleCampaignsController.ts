import settings from '@configs/settings';
import sequelize from '@initializers/sequelize';
import { MissingImportFile, NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import SaleCampaignProductModel from '@models/saleCampaignProducts';
import SaleCampaignModel from '@models/saleCampaigns';
import SaleCampaignImporterService from '@services/saleCampaignImporter';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';

class SaleCampaignController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(SaleCampaignModel.CREATABLE_PARAMETERS).value();
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const saleCampaign = await SaleCampaignModel.create(params, {
          include: [
            { model: SaleCampaignProductModel, as: 'productVariants' },
          ],
          transaction,
        });
        return saleCampaign;
      });
      sendSuccess(res, { saleCampaign: result });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const saleCampaign = await SaleCampaignModel.findByPk(req.params.saleCampaignId);
      if (!saleCampaign) {
        return sendError(res, 404, NoData);
      }
      const params = req.parameters.permit(SaleCampaignModel.UPDATABLE_PARAMETERS).value();
      await sequelize.transaction(async (transaction: Transaction) => {
        await saleCampaign.update(params, { transaction });
        await saleCampaign.updateSaleCampaignVariant(params.productVariants, transaction);
      });
      await saleCampaign.reloadWithDetail();
      sendSuccess(res, { saleCampaign });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async active (req: Request, res: Response) {
    try {
      const saleCampaign = await SaleCampaignModel.scope([
        'isNotActive',
        { method: ['byId', req.params.saleCampaignId] },
      ]).findOne();
      if (!saleCampaign) {
        return sendError(res, 404, NoData);
      }
      await saleCampaign.update({ isActive: true });
      sendSuccess(res, saleCampaign);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const saleCampaign = await SaleCampaignModel.scope([
        { method: ['byId', req.params.saleCampaignId] },
        'withVariant',
      ]).findOne();
      if (!saleCampaign) {
        return sendError(res, 404, NoData);
      }
      sendSuccess(res, saleCampaign);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async inactive (req: Request, res: Response) {
    try {
      const saleCampaign = await SaleCampaignModel.scope([
        'isActive',
        { method: ['byId', req.params.saleCampaignId] },
      ]).findOne();
      if (!saleCampaign) {
        return sendError(res, 404, NoData);
      }
      await saleCampaign.update({ isActive: false });
      sendSuccess(res, saleCampaign);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const saleCampaign = await SaleCampaignModel.findByPk(req.params.saleCampaignId);
      if (!saleCampaign) {
        return sendError(res, 404, NoData);
      }
      await saleCampaign.destroy();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const { freeWord, isActive, dateFrom, dateTo } = req.query;
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        { method: ['bySortOrder', sortBy, sortOrder] },
        { method: ['byDate', dateFrom, dateTo] },
        'withVariant',
      ];
      if (freeWord) { scopes.push({ method: ['byFreeWord', freeWord] }); }
      if (isActive === 'true') { scopes.push('isActive'); }
      if (isActive === 'false') { scopes.push('isNotActive'); }
      const { count, rows } = await SaleCampaignModel.scope(scopes).findAndCountAll({
        limit,
        offset,
        distinct: true,
        col: 'SaleCampaignModel.id',
      });
      sendSuccess(res, { rows, pagination: { total: count, page, perPage: limit, offset } });
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
      const adminImporter = new SaleCampaignImporterService(file);
      const saleCampaignProducts = await adminImporter.executeImport();
      sendSuccess(res, { saleCampaignProducts });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async downloadTemplate (req: Request, res: Response) {
    try {
      const file = 'public/Nhap-bang-gia.xlsx';
      res.download(file, 'Form tải lên bảng giá (Mẫu).xlsx');
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SaleCampaignController();
