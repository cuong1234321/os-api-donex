import { sendError, sendSuccess } from '@libs/response';
import BannerModel from '@models/banners';
import { Request, Response } from 'express';

class BannerController {
  public async index (req: Request, res: Response) {
    try {
      const { type } = req.params;
      const { position } = req.query;
      const scopes: any = [
        'active',
        { method: ['byType', type] },
        { method: ['bySorting', 'orderId', 'ASC'] },
      ];
      if (position) scopes.push({ method: ['byPosition', position] });
      const banners = await BannerModel.scope(scopes).findAll();
      sendSuccess(res, banners);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
};
export default new BannerController();
