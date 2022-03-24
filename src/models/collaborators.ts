import CollaboratorEntity from '@entities/collaborators';
import CollaboratorMediaInterface from '@interfaces/collaboratorMedia';
import CollaboratorInterface from '@interfaces/collaborators';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, Transaction, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import CollaboratorWorkingDayModel from './collaboratorWorkingDays';
import CollaboratorMediaModel from './collaboratorMedia';
import UserModel from './users';

class CollaboratorModel extends Model<CollaboratorInterface> implements CollaboratorInterface {
  public id: number;
  public userId: number;
  public parentId: number;
  public type: string;
  public status: string;
  public paperProofFront: string;
  public paperProofBack: string;
  public rejectionReason: string;
  public openTime: Date;
  public closeTime: Date;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt: Date;

  public static readonly TYPE_ENUM = { COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor' }
  public static readonly STATUS_ENUM = { PENDING: 'pending', ACTIVE: 'active', INACTIVE: 'inactive', REJECTED: 'rejected' }

  public static readonly INFORMATION_PARAMETERS = ['fullName', 'dateOfBirth', 'phoneNumber', 'username', 'password', 'email', 'provinceId', 'districtId', 'wardId', 'address', 'defaultRank']
  public static readonly CREATABLE_PARAMETERS = ['type', 'parentId', 'openTime', 'closeTime']
  public static readonly UPDATABLE_PARAMETERS = ['type', 'parentId', 'openTime', 'closeTime']

  static readonly hooks: Partial<ModelHooks<CollaboratorModel>> = { }

  static readonly validations: ModelValidateOptions = {
  }

  static readonly scopes: ModelScopeOptions = {
    addressInfo () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT title FROM m_provinces INNER JOIN users ON users.provinceId = m_provinces.id WHERE users.id = CollaboratorModel.userId)'),
              'provinceTitle',
            ],
            [
              Sequelize.literal('(SELECT title FROM m_districts INNER JOIN users ON users.districtId = m_districts.id WHERE users.id = CollaboratorModel.userId)'),
              'districtTitle',
            ],
            [
              Sequelize.literal('(SELECT title FROM m_wards INNER JOIN users ON users.wardId = m_wards.id WHERE users.id = CollaboratorModel.userId)'),
              'wardTitle',
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
    byStatus (status) {
      return {
        where: { status },
      };
    },
    byType (type) {
      return {
        where: { type },
      };
    },
    byFreeWord (freeWord) {
      return {
        where: {
          [Op.or]: [
            { id: { [Op.like]: `%${freeWord || ''}%` } },
            {
              userId: {
                [Op.in]: Sequelize.literal('(SELECT id FROM users WHERE deletedAt IS NULL AND ' +
                `(fullName LIKE '%${freeWord}%' OR phoneNumber LIKE '%${freeWord}%' OR username LIKE '%${freeWord}%'))`),
              },
            },
          ],
        },
      };
    },
    withUser () {
      return {
        include: {
          model: UserModel,
          as: 'user',
        },
      };
    },
    byUserId (userId) {
      return {
        where: { userId },
      };
    },
    withoutChildren () {
      return {
        where: {
          parentId: null,
        },
      };
    },
    withWorkingDay () {
      return {
        include: [{
          model: CollaboratorWorkingDayModel,
          as: 'workingDays',
        }],
      };
    },
    withMedia () {
      return {
        include: {
          model: CollaboratorMediaModel,
          as: 'media',
        },
      };
    },
  }

  public async checkStatus (status: string) {
    if (this.status !== status) {
      throw new ValidationErrorItem(`status is not ${status}.`, 'status', 'validStatus', this.status);
    }
  }

  public async reloadCollaborator () {
    await this.reload({
      include: [
        {
          model: UserModel,
          as: 'user',
        },
        {
          model: CollaboratorWorkingDayModel,
          as: 'workingDays',
        },
        {
          model: CollaboratorMediaModel,
          as: 'media',
        },
      ],
    });
  }

  public async updateMedias (medias: any[], transaction?: Transaction) {
    if (!medias) return;
    medias.forEach((record: any) => {
      record.collaboratorId = this.id;
    });

    const results = await CollaboratorMediaModel.bulkCreate(medias, {
      updateOnDuplicate: CollaboratorMediaModel.UPDATABLE_ON_DUPLICATE_PARAMETERS as (keyof CollaboratorMediaInterface)[],
      individualHooks: true,
      transaction,
    });
    await CollaboratorMediaModel.destroy({
      where: { collaboratorId: this.id, id: { [Op.notIn]: results.map((media) => media.id) } },
      individualHooks: true,
      transaction,
    });
  }

  public static initialize (sequelize: Sequelize) {
    this.init(CollaboratorEntity, {
      hooks: CollaboratorModel.hooks,
      scopes: CollaboratorModel.scopes,
      validate: CollaboratorModel.validations,
      tableName: 'collaborators',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(UserModel, { as: 'user', foreignKey: 'userId' });
    this.hasMany(CollaboratorWorkingDayModel, { as: 'workingDays', foreignKey: 'collaboratorId', onDelete: 'CASCADE', hooks: true });
    this.hasMany(CollaboratorMediaModel, { as: 'media', foreignKey: 'collaboratorId', onDelete: 'CASCADE', hooks: true });
  }
}

export default CollaboratorModel;
