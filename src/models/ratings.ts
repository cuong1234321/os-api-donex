import RatingEntity from '@entities/ratings';
import RatingInterface from '@interfaces/ratings';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import RatingImageModel from './ratingImages';

class RatingModel extends Model<RatingInterface> implements RatingInterface {
  public id: number;
  public creatableId: number;
  public creatableType: string;
  public subOrderId: number;
  public productVariantId: number;
  public content: string;
  public point: number;
  public status: string;
  public adminId: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public static readonly STATUS_ENUM = { DRAFT: 'draft', ACTIVE: 'active', INACTIVE: 'inactive' }
  public static readonly CREATABLE_ENUM = { USER: 'user' }

  public static readonly CREATABLE_PARAMETERS = ['content', 'point']

  static readonly hooks: Partial<ModelHooks<RatingModel>> = {
  }

  static readonly validations: ModelValidateOptions = {
    async validateRating () {
      const userRating = await RatingModel.scope([
        { method: ['byCreatable', this.creatableId, this.creatableType] },
        { method: ['bySubOrderId', this.subOrderId] },
        { method: ['byProductVariantId', this.productVariantId] },
      ]).findOne();
      if (userRating) {
        throw new ValidationErrorItem('Đơn hàng đã được đánh giá', 'validateRating');
      }
    },
  }

  static readonly scopes: ModelScopeOptions = {
    byCreatable (creatableId, creatableType) {
      return {
        where: {
          creatableId,
          creatableType,
        },
      };
    },
    bySubOrderId (subOrderId) {
      return {
        where: {
          subOrderId,
        },
      };
    },
    byProductVariantId (productVariantId) {
      return {
        where: {
          productVariantId,
        },
      };
    },
    byId (id) {
      return {
        where: { id },
      };
    },
    withImage () {
      return {
        include: [
          {
            model: RatingImageModel,
            as: 'images',
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
    this.init(RatingEntity, {
      tableName: 'ratings',
      scopes: RatingModel.scopes,
      hooks: RatingModel.hooks,
      validate: RatingModel.validations,
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.hasMany(RatingImageModel, { as: 'images', foreignKey: 'ratingAbleId' });
  }
}

export default RatingModel;
