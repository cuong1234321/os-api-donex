import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import BannerModel from '@models/banners';
import settings from '@configs/settings';
import { NoData } from '@libs/errors';

class BannerController {
  public async index (req: Request, res: Response) {
    try {
      const { title, isHighlight, position } = req.query;
      const type = req.params.type;
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(settings.defaultPerPage);
      const offset = (page - 1) * limit;
      let sortBy = req.query.sortBy || 'createdAt';
      let sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [];
      if (title) scopes.push({ method: ['byTitle', title] });
      if (position) { scopes.push({ method: ['byPosition', position] }); }
      if (type) { scopes.push({ method: ['byType', type] }); }
      if (isHighlight === 'true') {
        scopes.push('active');
        sortBy = 'orderId';
        sortOrder = 'ASC';
      }
      scopes.push({ method: ['bySorting', sortBy, sortOrder] });
      const { count, rows } = await BannerModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { banners: rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(BannerModel.CREATABLE_PARAMETERS).value();
      const banners = await BannerModel.create(params);
      sendSuccess(res, banners);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(BannerModel.UPDATABLE_PARAMETERS).value();
      const banner = await BannerModel.findByPk(req.params.bannerId);
      if (!banner) return sendError(res, 404, NoData);
      await banner.update(params);
      sendSuccess(res, banner);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const banner = await BannerModel.findByPk(req.params.bannerId);
      if (!banner) return sendError(res, 404, NoData);
      sendSuccess(res, banner);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async reorder (req: Request, res: Response) {
    try {
      const bannersOrder: any[] = req.body.bannersOrder;
      const { position, type }: any = req.params;
      const banners = await BannerModel.scope([
        { method: ['byId', bannersOrder.map((banner) => banner.id)] },
        { method: ['byPosition', position] },
        { method: ['byType', type] },
      ]).findAll();
      bannersOrder.sort((a: any, b: any) => a.orderId - b.orderId);
      let orderId = 1;
      for (const order of bannersOrder) {
        const banner = banners.find((record) => record.id === order.id);
        if (banner) {
          await banner.update({ orderId });
          orderId++;
        }
      }
      sendSuccess(res, banners);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const banner = await BannerModel.scope([{ method: ['byId', req.params.bannerId] }]).findOne();
      if (!banner) return sendError(res, 404, NoData);
      await banner.destroy();
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new BannerController();
