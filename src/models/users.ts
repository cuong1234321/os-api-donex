import UserEntity from '@entities/users';
import UserInterface from '@interfaces/users';
import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
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

  public static readonly STATUS_ENUM = { PENDING: 'pending', ACTIVE: 'active', INACTIVE: 'inactive' }

  static readonly hooks: Partial<ModelHooks<UserModel>> = { }

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
      tableName: 'users',
      sequelize,
    });
  }

  public static associate () {
  }
}

export default UserModel;
