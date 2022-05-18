import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import PermissionEntity from '@entities/permissions';
import PermissionInterface from '@interfaces/permissions';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import PermissionGroupInterface from '@interfaces/permissionGroups';
import PermissionGroupModel from './permissionGroups';
import RoleModel from './roles';
import RolePermissionModel from './rolePermissions';

class PermissionModel extends Model<PermissionInterface> implements PermissionInterface {
  public id: number;
  public groupId: number;
  public title: string;
  public key: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
  public group?: PermissionGroupInterface;

  static readonly hooks: Partial<ModelHooks<PermissionModel>> = { }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return { where: { id } };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(PermissionEntity, {
      hooks: PermissionModel.hooks,
      scopes: PermissionModel.scopes,
      tableName: 'permissions',
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(PermissionGroupModel, { as: 'group', foreignKey: 'groupId' });
    this.belongsToMany(RoleModel, { through: RolePermissionModel, as: 'permission', foreignKey: 'permissionId' });
  }
}

export default PermissionModel;
