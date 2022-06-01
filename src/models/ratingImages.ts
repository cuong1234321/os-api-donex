import RatingImagesEntity from '@entities/ratingImages';
import RatingImageInterface from '@interfaces/ratingImages';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import RatingModel from './ratings';

class RatingImageModel extends Model<RatingImageInterface> implements RatingImageInterface {
  public id: number;
  public ratingAbleId: number;
  public source: string;
  public type: string;
  public createdAt?: Date;
  public updatedAt?: Date;

public static readonly CREATABLE_PARAMETERS = [{ medias: ['source', 'type'] }]
public static readonly TYPE_ENUM = { IMAGE: 'image', VIDEO: 'video' }

  static readonly hooks: Partial<ModelHooks<RatingImageModel>> = {
  }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = {
    byType (type) {
      return { where: { type } };
    },
    byRatingId (ratingAbleId) {
      return {
        where: {
          ratingAbleId,
        },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(RatingImagesEntity, {
      tableName: 'rating_images',
      scopes: RatingImageModel.scopes,
      hooks: RatingImageModel.hooks,
      validate: RatingImageModel.validations,
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(RatingModel, { as: 'rating', foreignKey: 'ratingAbleId' });
  }
}

export default RatingImageModel;
