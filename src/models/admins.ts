import AdminEntity from '@entities/admins';
import AdminInterface from '@interfaces/admins';
import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import settings from '@configs/settings';

class AdminModel extends Model<AdminInterface> implements AdminInterface {
  public id: number;
  public fullName: string;
  public phoneNumber: string;
  public password: string;
  public email: string;
  public address: string;
  public dateOfBirth: Date;
  public gender: string;
  public status: string;
  public note: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  public static readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive' }

  static readonly hooks: Partial<ModelHooks<AdminModel>> = { }

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
    const token = jwt.sign({ id: this.id }, settings.jwt.adminSecret, { expiresIn: settings.jwt.ttl });
    return token;
  };

  public static initialize (sequelize: Sequelize) {
    this.init(AdminEntity, {
      hooks: AdminModel.hooks,
      scopes: AdminModel.scopes,
      tableName: 'admins',
      sequelize,
    });
  }

  public static associate () {
  }
}

export default AdminModel;
