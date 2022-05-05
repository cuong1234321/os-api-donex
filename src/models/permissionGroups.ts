import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import PermissionGroupEntity from '@entities/permissionGroups';
import PermissionGroupInterface from '@interfaces/permissionGroups';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import PermissionModel from './permissions';

class PermissionGroupModel extends Model<PermissionGroupInterface> implements PermissionGroupInterface {
  public id: number;
  public title: string;
  public key: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly hooks: Partial<ModelHooks<PermissionGroupModel>> = {

  }

  static readonly validations: ModelValidateOptions = {
  }

  static readonly scopes: ModelScopeOptions = {

  }

  public static initialize (sequelize: Sequelize) {
    this.init(PermissionGroupEntity, {
      hooks: PermissionGroupModel.hooks,
      scopes: PermissionGroupModel.scopes,
      tableName: 'permission_groups',
      sequelize,
    });
  }

  public static associate () {
    this.hasMany(PermissionModel, { as: 'permissions', foreignKey: 'groupId' });
  }
}

export default PermissionGroupModel;
