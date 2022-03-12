import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import PhoneNumberVerifyOtpModel from '@models/phoneNumberVerifyOtps';
import dayjs from 'dayjs';
import { Request, Response } from 'express';

class AuthenticationOtpController {
  public async sendOtp (req: Request, res: Response) {
    try {
      const { phoneNumber } = req.body;
      const phoneNumberVerifyOtp = await PhoneNumberVerifyOtpModel.findOrCreate({
        where: { phoneNumber },
        defaults: {
          id: undefined,
          phoneNumber,
          otp: '',
          otpExpiresAt: dayjs() as unknown as Date,
          verifyToken: null,
        },
      });
      if (!phoneNumberVerifyOtp[1]) await phoneNumberVerifyOtp[0].update({ });
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async verify (req: Request, res: Response) {
    try {
      const { otp, phoneNumber } = req.body;
      const phoneNumberVerifyOtp = await PhoneNumberVerifyOtpModel.scope([
        { method: ['byPhoneNumber', phoneNumber] },
      ]).findOne();
      if (!phoneNumberVerifyOtp || !await phoneNumberVerifyOtp.validOtp(otp)) return sendError(res, 404, NoData);
      await phoneNumberVerifyOtp.genToken();
      sendSuccess(res, { token: phoneNumberVerifyOtp.verifyToken });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new AuthenticationOtpController();
