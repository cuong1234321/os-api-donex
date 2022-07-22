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
  public thumbnail: string;
  public index: number;
  public deletedAt: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  public static readonly CREATABLE_PARAMETERS = ['title', 'index', 'thumbnail']
  public static readonly UPDATABLE_PARAMETERS = ['title', 'index', 'thumbnail']

  static readonly hooks: Partial<ModelHooks<NewsCategoryModel>> = {
    async afterDestroy (record, options) {
      await NewsModel.destroy({ where: { newsCategoryId: record.id }, individualHooks: true, transaction: options.transaction });
    },
    async beforeSave (record: any) {
      record.slug = SlugGeneration.execute(record.title);

      if (record.isNewRecord && !record.index) {
        const lastIndexRecord = await NewsCategoryModel.scope({ method: ['bySortOrder', 'index', 'DESC'] }).findOne();
        record.index = lastIndexRecord ? lastIndexRecord.index + 1 : 1;
      }
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
    newest () {
      return {
        order: [['createdAt', 'DESC']],
      };
    },
    bySortOrder (sortBy, sortOrder) {
      return {
        order: [[sortBy, sortOrder]],
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
