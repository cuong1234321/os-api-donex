import RatingEntity from '@entities/ratings';
import RatingInterface from '@interfaces/ratings';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class RatingModel extends Model<RatingInterface> implements RatingInterface {
  public id: number;
  public userId: number;
  public userType: string;
  public orderId: number;
  public content: string;
  public status: string;
  public adminId: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly hooks: Partial<ModelHooks<RatingModel>> = {
  }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = {}

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

  public static associate () { }
}

export default RatingModel;
