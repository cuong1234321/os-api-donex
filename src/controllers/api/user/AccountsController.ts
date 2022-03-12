import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import PhoneNumberVerifyOtpModel from '@models/phoneNumberVerifyOtps';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import sequelize from '@initializers/sequelize';

class AccountController {
  public async register (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(UserModel.CREATABLE_PARAMETERS).value();
      const { verifyToken } = req.body;
      const phoneNumberVerifyOtp = await PhoneNumberVerifyOtpModel.scope([
        { method: ['byPhoneNumber', params.phoneNumber] },
      ]).findOne();
      if (!phoneNumberVerifyOtp || !phoneNumberVerifyOtp.validToken(verifyToken)) return sendError(res, 404, NoData);
      let user: any;
      await sequelize.transaction(async (transaction: Transaction) => {
        user = await UserModel.create(params, { transaction });
        phoneNumberVerifyOtp.destroy({ transaction });
      });
      sendSuccess(res, { user });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new AccountController();
