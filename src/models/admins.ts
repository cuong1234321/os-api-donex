import AdminEntity from '@entities/admins';
import AdminInterface from '@interfaces/admins';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import settings from '@configs/settings';
import dayjs from 'dayjs';
import MailerService from '@services/mailer';
import randomString from 'randomstring';

class AdminModel extends Model<AdminInterface> implements AdminInterface {
  public id: number;
  public fullName: string;
  public username: string;
  public avatar: string;
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
  public roleId: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly CREATABLE_PARAMETERS = ['fullName', 'username', 'phoneNumber', 'gender', 'email', 'dateOfBirth', 'note']
  static readonly UPDATABLE_PARAMETERS = ['fullName', 'phoneNumber', 'gender', 'email', 'dateOfBirth', 'note']
  static readonly ADMIN_UPDATABLE_PARAMETERS = ['fullName', 'username', 'avatar', 'phoneNumber', 'gender', 'email', 'dateOfBirth']

  public static readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive' }

  static readonly hooks: Partial<ModelHooks<AdminModel>> = {
    beforeSave (record) {
      if (record.password && record.password !== record.previous('password')) {
        const salt = bcrypt.genSaltSync();
        record.password = bcrypt.hashSync(record.password, salt);
      }
    },
  }

  static readonly validations: ModelValidateOptions = {
    async validMatchPassword () {
      if (this.isNewRecord || !this.confirmPassword || this.password === this._previousDataValues.password) return;
      if (this.password !== this.confirmPassword && this._previousDataValues.password !== this.confirmPassword) {
        throw new ValidationErrorItem('Xác nhận mật khẩu không khớp.', 'password', 'validMatchPassword', this.confirmPassword);
      }
    },
    async uniquePhoneNumber () {
      if (this.phoneNumber) {
        const existedRecord = await AdminModel.scope([{ method: ['byPhoneNumber', this.phoneNumber] }]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Số điện thoại đã được sử dụng.', 'uniquePhoneNumber', 'phoneNumber', this.phoneNumber);
        }
      }
    },
    async uniqueUsername () {
      if (this.username) {
        const existedRecord = await AdminModel.scope([{ method: ['byUsername', this.username] }]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Tài khoản đã được sử dụng.', 'uniqueUsername', 'username', this.username);
        }
      }
    },
    async uniqueEmail () {
      if (this.email) {
        const existedRecord = await AdminModel.scope([{ method: ['byEmail', this.email] }]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Email đã được sử dụng.', 'uniqueEmail', 'email', this.email);
        }
      }
    },
    async validatePhoneNumber () {
      if (this.phoneNumber && !settings.phonePattern.test(this.phoneNumber)) {
        throw new ValidationErrorItem('Số điện thoại không hợp lệ', 'validatePhoneNumber', 'phoneNumber');
      }
    },
    async validateEmail () {
      if (this.email && !settings.emailPattern.test(this.email)) {
        throw new ValidationErrorItem('Email không hợp lệ', 'validateEmail', 'email');
      }
    },
  }

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return {
        where: { id },
      };
    },
    byPhoneNumber (phoneNumber) {
      return {
        where: { phoneNumber },
      };
    },
    byUsername (username) {
      return {
        where: { username },
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
    byGender (gender) {
      return {
        where: { gender },
      };
    },
    byFreeWord (freeWord) {
      return {
        where: {
          [Op.or]: [
            { id: { [Op.like]: `%${freeWord || ''}%` } },
            { fullName: { [Op.like]: `%${freeWord || ''}%` } },
            { username: { [Op.like]: `%${freeWord || ''}%` } },
            { phoneNumber: { [Op.like]: `%${freeWord || ''}%` } },
          ],
        },
      };
    },
    bySortOrder (orderConditions) {
      orderConditions.push([Sequelize.literal('createdAt'), 'DESC']);
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT SUBSTRING_INDEX(fullName, " ", -1) AS last_name  FROM admins WHERE id = AdminModel.id)'),
              'lastName',
            ],
          ],
        },
        order: orderConditions,
      };
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
    return this.forgotPasswordToken === token && (!this.forgotPasswordExpireAt || dayjs(this.forgotPasswordExpireAt).subtract(dayjs().valueOf(), 'ms').valueOf() > 0);
  }

  public async genLifetimeForgotPasswordToken () {
    const token = randomString.generate(64);
    await this.update(
      {
        forgotPasswordToken: token,
        forgotPasswordExpireAt: null,
      },
    );
  }

  public static initialize (sequelize: Sequelize) {
    this.init(AdminEntity, {
      hooks: AdminModel.hooks,
      scopes: AdminModel.scopes,
      validate: AdminModel.validations,
      tableName: 'admins',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
  }
}

export default AdminModel;
