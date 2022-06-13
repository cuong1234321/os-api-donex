import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import RankModel from '@models/ranks';

class RankController {
  public async index (req: Request, res: Response) {
    try {
      const { type } = req.query;
      const scopes:any = ['withRankCondition'];
      if (type) { scopes.push({ method: ['byType', type] }); }
      const ranks = await RankModel.scope(scopes).findAll();
      sendSuccess(res, { ranks });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new RankController();
