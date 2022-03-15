import CollaboratorEntity from '@entities/collaborators';
import CollaboratorInterface from '@interfaces/collaborators';
import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import UserModel from './users';

class CollaboratorModel extends Model<CollaboratorInterface> implements CollaboratorInterface {
  public id: number;
  public userId: number;
  public parentId: number;
  public type: string;
  public status: string;
  public paperProofFront: string;
  public paperProofBack: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt: Date;

  public static readonly TYPE_ENUM = { COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor' }
  public static readonly STATUS_ENUM = { PENDING: 'pending', ACTIVE: 'active', INACTIVE: 'inactive', REJECTED: 'rejected' }

  public static readonly INFORMATION_PARAMETERS = ['fullName', 'dateOfBirth', 'phoneNumber', 'username', 'password', 'email', 'provinceId', 'districtId', 'wardId', 'address', 'defaultRank']
  public static readonly CREATABLE_PARAMETERS = ['type', 'parentId']

  static readonly hooks: Partial<ModelHooks<CollaboratorModel>> = { }

  static readonly scopes: ModelScopeOptions = {
    withUser () {
      return {
        include: {
          model: UserModel,
          as: 'user',
        },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(CollaboratorEntity, {
      hooks: CollaboratorModel.hooks,
      scopes: CollaboratorModel.scopes,
      tableName: 'collaborators',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(UserModel, { as: 'user', foreignKey: 'userId' });
  }
}

export default CollaboratorModel;
