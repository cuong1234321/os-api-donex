import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { invalidParameter, InvalidPassword, NoData } from '@libs/errors';
import dayjs from 'dayjs';
import CollaboratorModel from '@models/collaborators';
import bcrypt from 'bcryptjs';

class PasswordController {
  public async forgotPassword (req:Request, res: Response) {
    try {
      const { email } = req.body;
      const seller = await CollaboratorModel.scope([
        { method: ['byEmail', email] },
      ]).findOne();
      if (!seller) { return sendError(res, 404, NoData); }
      if (seller) await seller.sendOtp();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async verifyOtp (req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const seller = await CollaboratorModel.scope([
        { method: ['byEmail', email] },
      ]).findOne();
      if (!seller || !seller.checkValidForgotPasswordToken(otp)) sendError(res, 404, NoData);
      await seller.genLifetimeForgotPasswordToken();
      await seller.reload();
      sendSuccess(res, { token: seller.forgotPasswordToken });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async resetPassword (req:Request, res:Response) {
    try {
      const { email, token, newPassword, confirmPassword } = req.body;
      const seller = await CollaboratorModel.scope([
        { method: ['byEmail', email] },
      ]).findOne();
      if (!seller || !await seller.checkValidForgotPasswordToken(token)) return sendError(res, 404, NoData);
      const params = {
        password: newPassword,
        confirmPassword,
        forgotPasswordExpireAt: dayjs(),
      };
      await seller.update(params);
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async changePassword (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const checkOldPassword = await bcrypt.compare(oldPassword, currentSeller.password);
      if (!checkOldPassword) { return sendError(res, 400, InvalidPassword); }
      if (!newPassword || newPassword !== confirmPassword) { return sendError(res, 400, invalidParameter); }
      await currentSeller.update({ password: newPassword }, { individualHooks: true });
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new PasswordController();
