import NewsEntity from '@entities/news';
import NewsInterface from '@interfaces/news';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, ValidationErrorItem } from 'sequelize';
import dayjs from 'dayjs';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import SlugGeneration from '@libs/slugGeneration';
import NewsCategoryModel from './newsCategories';

class NewsModel extends Model<NewsInterface> implements NewsInterface {
  public id: number;
  public title: string;
  public content: string;
  public thumbnail: string;
  public newsCategoryId: number;
  public publicAt: Date;
  public status: string;
  public slug: string;
  public views: number;
  public deletedAt: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  public static readonly STATUS_ENUM = { DRAFT: 'draft', ACTIVE: 'active', INACTIVE: 'inactive' }
  public static readonly CREATABLE_PARAMETERS = ['title', 'content', 'newsCategoryId']
  public static readonly UPDATABLE_PARAMETERS = ['title', 'content', 'newsCategoryId']

  static readonly hooks: Partial<ModelHooks<NewsModel>> = {
    beforeSave (record: any) {
      record.slug = SlugGeneration.execute(record.title);
      if (record.dataValues.status === NewsModel.STATUS_ENUM.ACTIVE && record._previousDataValues.status !== NewsModel.STATUS_ENUM.DRAFT) {
        record.publicAt = dayjs();
      }
    },
  }

  static readonly validations: ModelValidateOptions = {
    async validateCategory () {
      const blogCategory = await NewsCategoryModel.findByPk(this?.newsCategoryId);
      if (!blogCategory) {
        throw new ValidationErrorItem('Danh mục không hợp lệ', 'validateCategory', 'newsCategoryId', this.newsCategoryId);
      }
    },
  }

  static readonly scopes: ModelScopeOptions = {
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
    byCategory (newsCategoryId) {
      return {
        where: { newsCategoryId },
      };
    },
    byFreeWord (freeWord) {
      return {
        where: { title: { [Op.like]: `%${freeWord || ''}%` } },
      };
    },
    withNewCategory () {
      return {
        include: [
          {
            model: NewsCategoryModel,
            as: 'category',
          },
        ],
      };
    },
    bySortOrder (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(NewsEntity, {
      hooks: NewsModel.hooks,
      scopes: NewsModel.scopes,
      validate: NewsModel.validations,
      tableName: 'news',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.belongsTo(NewsCategoryModel, { as: 'category', foreignKey: 'newsCategoryId' });
  }
}

export default NewsModel;
