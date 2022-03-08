import { BadAuthentication, AccountNotActive } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import AdminModel from '@models/admins';
import { Request, Response } from 'express';
import settings from '@configs/settings';

class SessionController {
  public async create (req: Request, res: Response) {
    try {
      const { phoneNumber, password } = req.body;
      const admin = await AdminModel.scope([{ method: ['byPhoneNumber', phoneNumber] }]).findOne();
      if (!admin || !(await admin.validPassword(password))) {
        return sendError(res, 404, BadAuthentication);
      }
      if (admin.status !== AdminModel.STATUS_ENUM.ACTIVE) return sendError(res, 403, AccountNotActive);
      const accessToken = await admin.generateAccessToken();
      sendSuccess(res, { accessToken, tokenExpireAt: settings.jwt.ttl });
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }
}

export default new SessionController();
