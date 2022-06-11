import { BadAuthentication, AccountNotActive, NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Request, Response } from 'express';
import settings from '@configs/settings';
import RankModel from '@models/ranks';

class SessionController {
  public async create (req: Request, res: Response) {
    try {
      const { phoneNumber, password } = req.body;
      const user = await UserModel.scope([{ method: ['byPhoneNumber', phoneNumber] }]).findOne();
      if (!user || !(await user.validPassword(password))) {
        return sendError(res, 404, BadAuthentication);
      }
      if (user.status !== UserModel.STATUS_ENUM.ACTIVE) return sendError(res, 403, AccountNotActive);
      const accessToken = await user.generateAccessToken();
      sendSuccess(res, { accessToken, tokenExpireAt: settings.jwt.ttl });
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  public async getCurrentUser (req: Request, res: Response) {
    try {
      let user = req.currentUser;
      user = await UserModel.scope([
        { method: ['byId', user.id] },
        'addressInfo',
      ]).findOne();
      if (!user) sendError(res, 404, NoData);
      let userRank = null;
      if (user.rank === 'Basic') {
        userRank = await RankModel.scope([
          { method: ['byType', UserModel.RANK_ENUM.BASIC] },
          'withRankCondition',
        ]).findOne();
      } else if (user.rank === 'Vip') {
        userRank = await RankModel.scope([
          { method: ['byType', UserModel.RANK_ENUM.VIP] },
          'withRankCondition',
        ]).findOne();
      }
      user.setDataValue('userRank', userRank);
      sendSuccess(res, { user });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SessionController();
