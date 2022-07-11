import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import MFormEntity from '@entities/mForms';
import MFormInterface from '@interfaces/mForms';

class MFormModel extends Model<MFormInterface> implements MFormInterface {
  public id: number;
  public title: string;
  public slug: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly CREATABLE_PARAMETERS = ['title', 'slug']
  static readonly UPDATABLE_PARAMETERS = ['title', 'slug']

  static readonly scopes: ModelScopeOptions = {
    bySortOrder (sortBy, sortOrder) {
      return {
        order: [[sortBy, sortOrder]],
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(MFormEntity, {
      tableName: 'm_forms',
      scopes: MFormModel.scopes,
      sequelize,
    });
  }

  public static associate () { }
}

export default MFormModel;
