import CollaboratorEntity from '@entities/collaborators';
import CollaboratorInterface from '@interfaces/collaborators';
import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

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

  public static readonly TYPE_ENUM = { COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor' }
  public static readonly STATUS_ENUM = { PENDING: 'pending', ACTIVE: 'active', INACTIVE: 'inactive', REJECTED: 'rejected' }

  static readonly hooks: Partial<ModelHooks<CollaboratorModel>> = { }

  static readonly scopes: ModelScopeOptions = {
  }

  public static initialize (sequelize: Sequelize) {
    this.init(CollaboratorEntity, {
      hooks: CollaboratorModel.hooks,
      scopes: CollaboratorModel.scopes,
      tableName: 'collaborators',
      sequelize,
    });
  }

  public static associate () {
  }
}

export default CollaboratorModel;
