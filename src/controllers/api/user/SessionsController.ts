import { BadAuthentication, AccountNotActive } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Request, Response } from 'express';
import settings from '@configs/settings';

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
}

export default new SessionController();
