import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, Transaction } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import RoleInterface from '@interfaces/roles';
import RoleEntity from '@entities/roles';
import RolePermissionInterface from '@interfaces/rolePermissions';
import SlugGeneration from '@libs/slugGeneration';
import RolePermissionModel from './rolePermissions';
import PermissionModel from './permissions';
import AdminModel from './admins';

class RoleModel extends Model<RoleInterface> implements RoleInterface {
  public id: number;
  public title: string;
  public description: string;
  public code: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
  public totalUsers?: number

  public static readonly CREATABLE_PARAMETERS = ['title', 'description',
    { rolePermissions: ['permissionId'] }]

  public static readonly UPDATABLE_PARAMETERS = ['title', 'description',
    { rolePermissions: ['permissionId'] }]

  static readonly hooks: Partial<ModelHooks<RoleModel>> = {
    async afterDestroy (record) {
      await RolePermissionModel.destroy({ where: { roleId: record.id }, individualHooks: true });
    },
    async beforeSave (record: any) {
      if (!record.code || record._previousDataValues.title !== record.dataValues.title) {
        const code = await RoleModel.generateCode(record.title);
        record.code = code;
      }
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

  private static async generateCode (title: string, originalCode: string = undefined, overlapIndex: number = 0) {
    const slug = SlugGeneration.execute(title);
    let code = originalCode || slug.replace('-', ' ').match(/\b(\w)/g).join('').toUpperCase();
    code = overlapIndex === 0 ? code : `${code}${overlapIndex}`;
    const existedCode = await RoleModel.scope({ method: ['byCode', code] }).findOne();
    if (existedCode) {
      code = await RoleModel.generateCode(title, originalCode, overlapIndex + 1);
    };
    return code;
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
    byCode (code) {
      return {
        where: { code },
      };
    },
    withTotalUser () {
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal('(SELECT COUNT(*) from admins where admins.roleId = RoleModel.id)'), 'SIGNED'),
              'totalUsers',
            ],
          ],
        },
      };
    },
    byId (id) {
      return {
        where: { id },
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
    this.belongsToMany(PermissionModel, { through: RolePermissionModel, as: 'permissions', foreignKey: 'roleId' });
    this.hasMany(AdminModel, { as: 'admins', foreignKey: 'roleId' });
  }
}

export default RoleModel;
