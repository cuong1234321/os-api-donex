import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Request, Response } from 'express';
import { invalidParameter, InvalidPassword, NoData } from '@libs/errors';
import dayjs from 'dayjs';
import bcrypt from 'bcryptjs';

class PasswordController {
  public async forgotPassword (req:Request, res: Response) {
    try {
      const { phoneNumber } = req.body;
      const user = await UserModel.scope([
        { method: ['byPhoneNumber', phoneNumber] },
      ]).findOne();
      if (user) await user.sendOtp();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async verifyOtp (req: Request, res: Response) {
    try {
      const { phoneNumber, otp } = req.body;
      const user = await UserModel.scope([
        { method: ['byPhoneNumber', phoneNumber] },
      ]).findOne();
      if (!user || !user.checkValidForgotPasswordToken(otp)) sendError(res, 404, NoData);
      await user.genLifetimeForgotPasswordToken();
      await user.reload();
      sendSuccess(res, { token: user.forgotPasswordToken });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async resetPassword (req:Request, res:Response) {
    try {
      const { phoneNumber, token, newPassword, confirmPassword } = req.body;
      const user = await UserModel.scope([
        { method: ['byPhoneNumber', phoneNumber] },
      ]).findOne();
      if (!user || !await user.checkValidForgotPasswordToken(token)) return sendError(res, 404, NoData);
      const params = {
        password: newPassword,
        confirmPassword,
        forgotPasswordExpireAt: dayjs(),
      };
      await user.update(params);
      sendSuccess(res, { user });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async changePassword (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const checkOldPassword = await bcrypt.compare(oldPassword, currentUser.password);
      if (!checkOldPassword) { return sendError(res, 400, InvalidPassword); }
      if (!newPassword || newPassword !== confirmPassword) { return sendError(res, 400, invalidParameter); }
      await UserModel.update({ password: newPassword }, { where: { id: currentUser.id }, individualHooks: true });
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new PasswordController();
