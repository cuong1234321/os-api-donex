import settings from '@configs/settings';
import PhoneNumberVerifyOtpsEntity from '@entities/phoneNumberVerifyOtps';
import PhoneNumberVerifyOtpsInterface from '@interfaces/phoneNumberVerifyOtps';
import dayjs from 'dayjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import randomString from 'randomstring';
import SendSmsService from '@services/smsSender';
import UserModel from './users';

class PhoneNumberVerifyOtpsModel extends Model<PhoneNumberVerifyOtpsInterface> implements PhoneNumberVerifyOtpsInterface {
  public id: number;
  public otp: string;
  public phoneNumber: string;
  public otpExpiresAt: Date;
  public verifyToken: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly hooks: Partial<ModelHooks<PhoneNumberVerifyOtpsModel>> = {
    async beforeSave (record) {
      await record.genOtp();
    },
    afterSave (record) {
      if (!record.verifyToken) SendSmsService.sendAuthenticateOtp(record.phoneNumber, record.otp);
    },
  }

  static readonly validations: ModelValidateOptions = {
    async uniquePhoneNumber () {
      if (this.phoneNumber) {
        const existedRecord = await UserModel.findOne({
          where: { phoneNumber: this.phoneNumber },
        });
        if (existedRecord) {
          throw new ValidationErrorItem('Số điện thoại đã được sử dụng.', 'uniquePhoneNumber', 'phoneNumber', this.phoneNumber);
        }
        if (!settings.phonePattern.test(this.phoneNumber)) {
          throw new ValidationErrorItem('Số điện thoại Không hợp lệ.', 'uniquePhoneNumber', 'phoneNumber', this.phoneNumber);
        }
      }
    },
  }

  static readonly scopes: ModelScopeOptions = {
    byPhoneNumber (phoneNumber) {
      return {
        where: { phoneNumber },
      };
    },
  }

  private async genOtp () {
    const otp = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
    const otpExpiresAt = dayjs().add(settings.minuteOfOtpExpires, 'minute') as unknown as Date;
    this.otp = otp;
    this.otpExpiresAt = otpExpiresAt;
    return this;
  }

  public async validOtp (otp: string) {
    return (otp === this.otp && dayjs(this.otpExpiresAt).subtract(dayjs().valueOf(), 'ms').valueOf() >= 0);
  }

  public async genToken () {
    const token = randomString.generate(64);
    await this.update({ verifyToken: token, otpExpiresAt: dayjs() });
  }

  public async validToken (token: string) {
    return (this.verifyToken && this.verifyToken === token);
  }

  public static initialize (sequelize: Sequelize) {
    this.init(PhoneNumberVerifyOtpsEntity, {
      hooks: PhoneNumberVerifyOtpsModel.hooks,
      scopes: PhoneNumberVerifyOtpsModel.scopes,
      validate: PhoneNumberVerifyOtpsModel.validations,
      tableName: 'phone_number_verify_otps',
      sequelize,
    });
  }

  public static associate () {
  }
}

export default PhoneNumberVerifyOtpsModel;
