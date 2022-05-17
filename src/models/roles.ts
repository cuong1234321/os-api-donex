import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, Transaction } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import RoleInterface from '@interfaces/roles';
import RoleEntity from '@entities/roles';
import RolePermissionInterface from '@interfaces/rolePermissions';
import RolePermissionModel from './rolePermissions';
import PermissionModel from './permissions';

class RoleModel extends Model<RoleInterface> implements RoleInterface {
  public id: number;
  public title: string;
  public description: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public static readonly CREATABLE_PARAMETERS = ['title', 'description',
    { rolePermissions: ['permissionId'] }]

  public static readonly UPDATABLE_PARAMETERS = ['title', 'description',
    { rolePermissions: ['permissionId'] }]

  static readonly hooks: Partial<ModelHooks<RoleModel>> = {
    async afterDestroy (record) {
      await RolePermissionModel.destroy({ where: { roleId: this.id }, individualHooks: true });
    },
  }

  static readonly validations: ModelValidateOptions = {
  }

  public async updateRolePermissions (medias: any[], transaction?: Transaction) {
    if (!medias) return;
    medias.forEach((record: any) => {
      record.roleId = this.id;
    });
    const results = await RolePermissionModel.bulkCreate(medias, {
      updateOnDuplicate: RolePermissionModel.UPDATABLE_ON_DUPLICATE_PARAMETERS as (keyof RolePermissionInterface)[],
      individualHooks: true,
      transaction,
    });
    await RolePermissionModel.destroy({
      where: { roleId: this.id, id: { [Op.notIn]: results.map((media) => media.id) } },
      individualHooks: true,
      transaction,
    });
  }

  public async reloadWithDetail () {
    await this.reload({
      include: [
        {
          model: RolePermissionModel,
          as: 'rolePermissions',
          include: [{
            model: PermissionModel,
            as: 'permission',
          }],
        },
      ],
    });
  }

  static readonly scopes: ModelScopeOptions = {
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    withRolePermission () {
      return {
        include: [{
          model: RolePermissionModel,
          as: 'rolePermissions',
        }],
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(RoleEntity, {
      hooks: RoleModel.hooks,
      scopes: RoleModel.scopes,
      tableName: 'roles',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
    this.hasMany(RolePermissionModel, { as: 'rolePermissions', foreignKey: 'roleId' });
  }
}

export default RoleModel;
