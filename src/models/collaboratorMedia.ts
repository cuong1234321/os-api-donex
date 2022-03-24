import CollaboratorMediaEntity from '@entities/collaboratorMedia';
import CollaboratorMediaInterface from '@interfaces/collaboratorMedia';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class CollaboratorMediaModel extends Model<CollaboratorMediaInterface> implements CollaboratorMediaInterface {
  public id: number;
  public collaboratorId: number;
  public source: string;
  public type: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly TYPE_ENUM = { INSIDE: 'inside', OUTSIDE: 'outside' }
  static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'type']
  static readonly UPDATABLE_PARAMETERS = ['id', 'type']

  static readonly hooks: Partial<ModelHooks<CollaboratorMediaModel>> = { }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = {
    byCollaboratorId (collaboratorId) {
      return {
        where: {
          collaboratorId,
        },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(CollaboratorMediaEntity, {
      hooks: CollaboratorMediaModel.hooks,
      scopes: CollaboratorMediaModel.scopes,
      validate: CollaboratorMediaModel.validations,
      tableName: 'collaborator_media',
      sequelize,
    });
  }

  public static associate () { }
}

export default CollaboratorMediaModel;
