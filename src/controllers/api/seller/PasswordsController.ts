import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { NoData } from '@libs/errors';
import dayjs from 'dayjs';
import CollaboratorModel from '@models/collaborators';

class PasswordController {
  public async forgotPassword (req:Request, res: Response) {
    try {
      const { phoneNumber } = req.body;
      const seller = await CollaboratorModel.scope([
        { method: ['byPhoneNumber', phoneNumber] },
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
      const { phoneNumber, otp } = req.body;
      const seller = await CollaboratorModel.scope([
        { method: ['byPhoneNumber', phoneNumber] },
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
      const { phoneNumber, token, newPassword, confirmPassword } = req.body;
      const seller = await CollaboratorModel.scope([
        { method: ['byPhoneNumber', phoneNumber] },
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
}

export default new PasswordController();
