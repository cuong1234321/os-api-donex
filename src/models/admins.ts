import AdminEntity from '@entities/admins';
import AdminInterface from '@interfaces/admins';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import settings from '@configs/settings';
import dayjs from 'dayjs';
import MailerService from '@services/mailer';

class AdminModel extends Model<AdminInterface> implements AdminInterface {
  public id: number;
  public fullName: string;
  public phoneNumber: string;
  public password: string;
  public confirmPassword?: string;
  public email: string;
  public address: string;
  public dateOfBirth: Date;
  public gender: string;
  public status: string;
  public note: string;
  public forgotPasswordToken: string;
  public forgotPasswordExpireAt: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  public static readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive' }

  static readonly hooks: Partial<ModelHooks<AdminModel>> = {
    beforeSave (record) {
      if (record.password && record.password !== record.previous('password')) {
        const salt = bcrypt.genSaltSync();
        record.password = bcrypt.hashSync(record.password, salt);
      }
    },
  }

  static readonly scopes: ModelScopeOptions = {
    byPhoneNumber (phoneNumber) {
      return {
        where: { phoneNumber },
      };
    },
    byEmail (email) {
      return {
        where: { email },
      };
    },
    byStatus (status) {
      return {
        where: { status },
      };
    },
  }

  static readonly validations: ModelValidateOptions = {
    async validMatchPassword () {
      if (this.isNewRecord || !this.confirmPassword || this.password === this._previousDataValues.password) return;
      if (this.password !== this.confirmPassword && this._previousDataValues.password !== this.confirmPassword) {
        throw new ValidationErrorItem('Xác nhận mật khẩu không khớp.', 'password', 'validMatchPassword', this.confirmPassword);
      }
    },
  }

  public async validPassword (password: string) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      return false;
    }
  }

  public async generateAccessToken () {
    const token = jwt.sign({ id: this.id }, settings.jwt.adminSecret, { expiresIn: settings.jwt.ttl });
    return token;
  };

  public async forgotPassword () {
    const token = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
    const expireAt = (dayjs().add(settings.forgotPasswordTokenExpiresIn, 'day'));
    await this.update(
      {
        forgotPasswordToken: token,
        forgotPasswordExpireAt: expireAt,
      },
    );
    MailerService.forgotPassWord(this, token);
  }

  public async checkValidForgotPasswordToken (token: string) {
    return this.forgotPasswordToken === token && dayjs(this.forgotPasswordExpireAt).subtract(dayjs().valueOf(), 'ms').valueOf() > 0;
  }

  public static initialize (sequelize: Sequelize) {
    this.init(AdminEntity, {
      hooks: AdminModel.hooks,
      scopes: AdminModel.scopes,
      validate: AdminModel.validations,
      tableName: 'admins',
      sequelize,
    });
  }

  public static associate () {
  }
}

export default AdminModel;
