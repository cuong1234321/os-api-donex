import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import RankModel from '@models/ranks';
import sequelize from '@initializers/sequelize';
import { Transaction } from 'sequelize/types';
import RankConditionModel from '@models/rankConditions';

class RankController {
  public async show (req: Request, res: Response) {
    try {
      const { type } = req.params;
      const ranks = (await RankModel.findOrCreate({
        where: {
          type,
        },
        defaults: { id: undefined, type },
      }))[0];
      const conditions = await ranks.getConditions();
      ranks.setDataValue('conditions', conditions);
      sendSuccess(res, { ranks });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const { type } = req.params;
      const rank = (await RankModel.findOrCreate({
        where: {
          type,
        },
        defaults: { id: undefined, type },
      }))[0];
      const params = req.parameters.permit(RankModel.UPDATABLE_PARAMETERS).value();
      params.dateEarnDiscount = req.body.dateEarnDiscount;
      await sequelize.transaction(async (transaction: Transaction) => {
        await rank.update(params, { transaction });
        await rank.updateConditions(params.conditions, transaction);
      });
      await rank.reload({ include: [{ model: RankConditionModel, as: 'conditions' }] });
      sendSuccess(res, { rank });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new RankController();
