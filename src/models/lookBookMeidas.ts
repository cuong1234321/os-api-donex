import LookBookMediaEntity from '@entities/lookBookMedias';
import LookBookMediaInterface from '@interfaces/lookBookMedias';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class LookBookMediaModel extends Model<LookBookMediaInterface> implements LookBookMediaInterface {
  public id: number;
  public lookBookId: number;
  public source: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS: ['id', 'source']

  static readonly validations: ModelValidateOptions = { }

  static readonly hooks: Partial<ModelHooks<LookBookMediaModel>> = { }

  static readonly scopes: ModelScopeOptions = { }

  public static initialize (sequelize: Sequelize) {
    this.init(LookBookMediaEntity, {
      scopes: LookBookMediaModel.scopes,
      validate: LookBookMediaModel.validations,
      hooks: LookBookMediaModel.hooks,
      tableName: 'look_book_medias',
      sequelize,
    });
  }

  public static associate () { }
}

export default LookBookMediaModel;
