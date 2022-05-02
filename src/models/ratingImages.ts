import RatingImagesEntity from '@entities/ratingImages';
import RatingImageInterface from '@interfaces/ratingImages';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import RatingModel from './ratings';

class RatingImageModel extends Model<RatingImageInterface> implements RatingImageInterface {
  id: number;
  ratingAbleId: number;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;

  static readonly hooks: Partial<ModelHooks<RatingImageModel>> = {
  }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = {}

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
