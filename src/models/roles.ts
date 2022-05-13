import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import RoleInterface from '@interfaces/roles';
import RoleEntity from '@entities/roles';
import RolePermissionModel from './rolePermissions';

class RoleModel extends Model<RoleInterface> implements RoleInterface {
  public id: number;
  public title: string;
  public description: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly hooks: Partial<ModelHooks<RoleModel>> = {

  }

  static readonly validations: ModelValidateOptions = {
  }

  static readonly scopes: ModelScopeOptions = { }

  public static initialize (sequelize: Sequelize) {
    this.init(RoleEntity, {
      hooks: RoleModel.hooks,
      scopes: RoleModel.scopes,
      tableName: 'roles',
      sequelize,
    });
  }

  public static associate () {
    this.hasMany(RolePermissionModel, { as: 'rolePermission', foreignKey: 'roleId' });
  }
}

export default RoleModel;
