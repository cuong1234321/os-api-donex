import { sendError, sendSuccess } from '@libs/response';
import AdminModel from '@models/admins';
import { Request, Response } from 'express';
import { NoData } from '@libs/errors';
import dayjs from 'dayjs';

class PasswordController {
  public async forgotPassword (req:Request, res: Response) {
    try {
      const email = req.body.email;
      const admin = await AdminModel.scope([
        { method: ['byEmail', email] },
      ]).findOne();
      if (admin) await admin.forgotPassword();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async resetPassword (req:Request, res:Response) {
    try {
      const email = req.query.email as string;
      const token = req.query.token as string;
      const { newPassword, confirmPassword } = req.body;
      const admin = await AdminModel.scope([
        { method: ['byEmail', email] },
      ]).findOne();
      if (!admin || !await admin.checkValidForgotPasswordToken(token)) return sendError(res, 404, NoData);
      const params = {
        password: newPassword,
        confirmPassword,
        forgotPasswordExpireAt: dayjs(),
      };
      await admin.update(params);
      sendSuccess(res, { admin });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new PasswordController();
