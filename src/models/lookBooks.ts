import LookBookEntity from '@entities/lookBooks';
import LookBookMediaInterface from '@interfaces/lookBookMedias';
import LookBookInterface from '@interfaces/lookBooks';
import SlugGeneration from '@libs/slugGeneration';
import { HasManyGetAssociationsMixin, Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, Transaction } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import LookBookMediaModel from './lookBookMeidas';

class LookBookModel extends Model<LookBookInterface> implements LookBookInterface {
  public id: number;
  public title: string;
  public description: string;
  public thumbnail: string;
  public slug: string;
  public status: boolean;
  public parentId: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  public static readonly CREATABLE_PARAMETERS = ['title', 'description', 'thumbnail', 'status',
    { medias: ['source'] },
    { children: ['title', 'description', 'thumbnail'] },
  ]

  public static readonly UPDATABLE_PARAMETERS = ['title', 'description', 'thumbnail', 'status', 'parentId',
    { medias: ['id', 'source'] },
    { children: ['id', 'title', 'description', 'thumbnail'] },
  ]

  static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'title', 'description', 'thumbnail']
  public static readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive' }

  static readonly hooks: Partial<ModelHooks<LookBookModel>> = {
    async afterSave (record: any, options) {
      if (record.dataValues.title !== record._previousDataValues.title && !record.parentId) {
        await record.update({ slug: `${SlugGeneration.execute(record.title)}-${record.id}` }, { transaction: options.transaction, hooks: false });
      }
    },
  }

  static readonly validations: ModelValidateOptions = { }

  public getMedias: HasManyGetAssociationsMixin<LookBookMediaModel>
  public getChildren: HasManyGetAssociationsMixin<LookBookModel>

  public async updateMedias (mediaAttributes: any[], transaction?: Transaction) {
    if (!mediaAttributes) return;
    mediaAttributes.forEach((record) => { record.lookBookId = this.id; });
    const medias = await LookBookMediaModel.bulkCreate(mediaAttributes, {
      updateOnDuplicate: LookBookMediaModel.UPDATABLE_ON_DUPLICATE_PARAMETERS as (keyof LookBookMediaInterface)[],
      individualHooks: true,
      transaction,
    });
    await LookBookMediaModel.destroy({
      where: { lookBookId: this.id, id: { [Op.notIn]: medias.map((record) => record.id) } },
      transaction,
    });
  }

  public async updateChildren (lookBookChildrenAttributes: any[], transaction?: Transaction) {
    if (!lookBookChildrenAttributes) return;
    lookBookChildrenAttributes.forEach((record) => { record.parentId = this.id; });
    const children = await LookBookModel.bulkCreate(lookBookChildrenAttributes, {
      updateOnDuplicate: LookBookModel.UPDATABLE_ON_DUPLICATE_PARAMETERS as (keyof LookBookInterface)[],
      individualHooks: true,
      transaction,
    });
    await LookBookModel.destroy({
      where: { parentId: this.id, id: { [Op.notIn]: children.map((record) => record.id) } },
      transaction,
    });
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
    byFreeWord (freeWord) {
      return {
        where: { title: { [Op.substring]: freeWord } },
      };
    },
    bySortOrder (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    withMedias () {
      return {
        include: [
          {
            model: LookBookMediaModel,
            as: 'medias',
          },
        ],
      };
    },
    withoutParent () {
      return {
        where: { parentId: { [Op.is]: null } },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(LookBookEntity, {
      scopes: LookBookModel.scopes,
      validate: LookBookModel.validations,
      hooks: LookBookModel.hooks,
      tableName: 'look_books',
      sequelize,
    });
  }

  public static associate () {
    this.hasMany(LookBookMediaModel, { as: 'medias', foreignKey: 'lookBookId', onDelete: 'CASCADE', hooks: false });
    this.hasMany(LookBookModel, { as: 'children', foreignKey: 'parentId', onDelete: 'CASCADE', hooks: false });
  }
}

export default LookBookModel;
