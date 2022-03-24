import UserEntity from '@entities/users';
import UserInterface from '@interfaces/users';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import settings from '@configs/settings';
import dayjs from 'dayjs';
import SendSmsService from '@services/smsSender';
import randomString from 'randomstring';
import CollaboratorModel from './collaborators';

class UserModel extends Model<UserInterface> implements UserInterface {
  public id: number;
  public adminId: number;
  public provinceId: number;
  public districtId: number;
  public wardId: number;
  public address: string;
  public fullName: string;
  public phoneNumber: string;
  public username: string;
  public password: string;
  public confirmPassword?: string;
  public email: string;
  public dateOfBirth: Date;
  public gender: string;
  public status: string;
  public note: string;
  public defaultRank: number;
  public currentRank: number;
  public forgotPasswordToken: string;
  public forgotPasswordExpireAt: Date;
  public avatar: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt: Date;

  public static readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive' }
  public static readonly CREATABLE_PARAMETERS = ['phoneNumber', 'fullName', 'password', 'confirmPassword']

  public static readonly CREATABLE_COLLABORATOR_PARAMETERS = ['phoneNumber', 'fullName', 'email', 'provinceId', 'districtId', 'wardId', 'address',
    { collaborator: ['type'] },
  ]

  static readonly hooks: Partial<ModelHooks<UserModel>> = {
    beforeSave (record) {
      if (record.password && record.password !== record.previous('password')) {
        const salt = bcrypt.genSaltSync();
        record.password = bcrypt.hashSync(record.password, salt);
      }
    },
  }

  static readonly validations: ModelValidateOptions = {
    async uniquePhoneNumber () {
      if (this.phoneNumber) {
        const existedRecord = await UserModel.findOne({
          attributes: ['id'], where: { phoneNumber: this.phoneNumber },
        });
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Số điện thoại đã được sử dụng.', 'uniquePhoneNumber', 'phoneNumber', this.phoneNumber);
        }
      }
    },
    async validMatchPassword () {
      if (!this.confirmPassword || this.password === this._previousDataValues.password) return;
      if (this.password !== this.confirmPassword && this._previousDataValues.password !== this.confirmPassword) {
        throw new ValidationErrorItem('Xác nhận mật khẩu không khớp.', 'password', 'validMatchPassword', this.confirmPassword);
      }
    },
  }

  static readonly scopes: ModelScopeOptions = {
    byPhoneNumber (phoneNumber) {
      return {
        where: { phoneNumber },
      };
    },
    byStatus (status) {
      return {
        where: { status },
      };
    },
  }

  public async checkStatus (status: string) {
    if (this.status !== status) {
      throw new ValidationErrorItem(`status is not ${status}.`, 'status', 'validStatus', this.status);
    }
  }

  public async validPassword (password: string) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      return false;
    }
  }

  public async sendOtp () {
    const token = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
    const expireAt = (dayjs().add(settings.forgotPasswordTokenExpiresIn, 'day'));
    await this.update(
      {
        forgotPasswordToken: token,
        forgotPasswordExpireAt: expireAt,
      },
    );
    await SendSmsService.sendAuthenticateOtp(this.phoneNumber, token);
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

  public async generateAccessToken () {
    const token = jwt.sign({ id: this.id }, settings.jwt.userSecret, { expiresIn: settings.jwt.ttl });
    return token;
  };

  public static initialize (sequelize: Sequelize) {
    this.init(UserEntity, {
      hooks: UserModel.hooks,
      scopes: UserModel.scopes,
      validate: UserModel.validations,
      tableName: 'users',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
    this.hasOne(CollaboratorModel, { as: 'collaborator', foreignKey: 'userId' });
  }
}

export default UserModel;
