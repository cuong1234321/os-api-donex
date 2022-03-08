import { InvalidOtp, NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Request, Response } from 'express';

class AccountController {
  public async register (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(UserModel.CREATABLE_PARAMETERS).value();
      const user: any = await UserModel.create(params);
      await user.sendAuthenticateOtp();
      delete user.dataValues.registerVerificationToken;
      sendSuccess(res, { user });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async verify (req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { otp } = req.body;
      const user = await UserModel.findByPk(userId);
      if (!user || user.status !== UserModel.STATUS_ENUM.PENDING) return sendError(res, 404, NoData);
      if (!user.registerVerificationToken || otp !== user.registerVerificationToken) return sendError(res, 404, InvalidOtp);
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async createPassword (req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { password, confirmPassword, otp } = req.body;
      const user = await UserModel.findByPk(userId);
      if (!user || user.status !== UserModel.STATUS_ENUM.PENDING) return sendError(res, 404, NoData);
      if (!user.registerVerificationToken || otp !== user.registerVerificationToken) return sendError(res, 404, InvalidOtp);
      await user.update({
        password,
        confirmPassword,
        registerVerificationToken: null,
        status: UserModel.STATUS_ENUM.ACTIVE,
      });
      sendSuccess(res, { user });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new AccountController();
