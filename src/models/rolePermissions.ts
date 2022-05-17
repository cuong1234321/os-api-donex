import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import RolePermissionEntity from '@entities/rolePermissions';
import RolePermissionInterface from '@interfaces/rolePermissions';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import PermissionInterface from '@interfaces/permissions';
import PermissionModel from './permissions';

class RolePermissionModel extends Model<RolePermissionInterface> implements RolePermissionInterface {
  public id: number;
  public roleId: number;
  public permissionId: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
  public permission?: PermissionInterface;

  static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'permissionId'];

  static readonly hooks: Partial<ModelHooks<RolePermissionModel>> = { }

  static readonly validations: ModelValidateOptions = {
  }

  static readonly scopes: ModelScopeOptions = {
    byRole (roleId) {
      return { where: { roleId } };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(RolePermissionEntity, {
      hooks: RolePermissionModel.hooks,
      scopes: RolePermissionModel.scopes,
      tableName: 'role_permissions',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(PermissionModel, { as: 'permission', foreignKey: 'permissionId' });
  }
}

export default RolePermissionModel;
