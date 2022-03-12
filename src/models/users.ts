import UserEntity from '@entities/users';
import UserInterface from '@interfaces/users';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import settings from '@configs/settings';

class UserModel extends Model<UserInterface> implements UserInterface {
  public id: number;
  public adminId: number;
  public provinceId: number;
  public districtId: number;
  public wardId: number;
  public address: string;
  public fullName: string;
  public phoneNumber: string;
  public password: string;
  public confirmPassword?: string;
  public email: string;
  public dateOfBirth: Date;
  public gender: string;
  public status: string;
  public note: string;
  public defaultRank: number;
  public currentRank: number;
  public registerVerificationToken: string;
  public forgotPasswordToken: number;
  public forgotPasswordExpireAt: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  public static readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive' }
  public static readonly CREATABLE_PARAMETERS = ['phoneNumber', 'fullName', 'password', 'confirmPassword']

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
  }

  public async validPassword (password: string) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      return false;
    }
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
      sequelize,
    });
  }

  public static associate () {
  }
}

export default UserModel;
