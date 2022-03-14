import NewsEntity from '@entities/news';
import NewsInterface from '@interfaces/news';
import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class NewsModel extends Model<NewsInterface> implements NewsInterface {
  public id: number;
  public title: string;
  public content: string;
  public thumbnail: string;
  public newsCategoryId: number;
  public publicAt: Date;
  public status: string;
  public deletedAt: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  public static readonly STATUS_ENUM = { DRAFT: 'draft', ACTIVE: 'active', INACTIVE: 'inactive' }
  public static readonly CREATABLE_PARAMETERS = ['title', 'content', 'categoryNewsId']
  public static readonly UPDATABLE_PARAMETERS = ['title', 'content', 'categoryNewsId']

  static readonly hooks: Partial<ModelHooks<NewsModel>> = { }

  static readonly scopes: ModelScopeOptions = {
  }

  public static initialize (sequelize: Sequelize) {
    this.init(NewsEntity, {
      hooks: NewsModel.hooks,
      scopes: NewsModel.scopes,
      tableName: 'news',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
  }
}

export default NewsModel;
