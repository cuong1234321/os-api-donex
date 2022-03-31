import NewsCategoriesEntity from '@entities/newsCategories';
import NewsCategoriesInterface from '@interfaces/newsCategories';
import SlugGeneration from '@libs/slugGeneration';
import { Model, ModelScopeOptions, Op, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import NewsModel from './news';

class NewsCategoryModel extends Model<NewsCategoriesInterface> implements NewsCategoriesInterface {
  public id: number;
  public title: string;
  public slug: string;
  public deletedAt: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  public static readonly CREATABLE_PARAMETERS = ['title']
  public static readonly UPDATABLE_PARAMETERS = ['title']

  static readonly hooks: Partial<ModelHooks<NewsCategoryModel>> = {
    async afterDestroy (record, options) {
      await NewsModel.destroy({ where: { newsCategoryId: record.id }, individualHooks: true, transaction: options.transaction });
    },
    beforeSave (record: any) {
      record.slug = SlugGeneration.execute(record.title);
    },
  }

  static readonly scopes: ModelScopeOptions = {
    byFreeWord (keyWord) {
      return {
        where: {
          title: { [Op.like]: `%${keyWord || ''}%` },
        },
      };
    },
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
    this.hasMany(NewsModel, { as: 'news', foreignKey: 'newsCategoryId' });
  }
}

export default NewsCategoryModel;
