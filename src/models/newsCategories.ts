import NewsCategoriesEntity from '@entities/newsCategories';
import NewsCategoriesInterface from '@interfaces/newsCategories';
import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class NewsCategoryModel extends Model<NewsCategoriesInterface> implements NewsCategoriesInterface {
  public id: number;
  public title: string;
  public description: string;
  public avatar: string;
  public status: string;
  public deletedAt: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  public static readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive' }

  static readonly hooks: Partial<ModelHooks<NewsCategoryModel>> = { }

  static readonly scopes: ModelScopeOptions = {
  }

  public static initialize (sequelize: Sequelize) {
    this.init(NewsCategoriesEntity, {
      hooks: NewsCategoryModel.hooks,
      scopes: NewsCategoryModel.scopes,
      tableName: 'news_categories',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
  }
}

export default NewsCategoryModel;
