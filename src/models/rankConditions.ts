import RankConditionEntity from '@entities/rankConditions';
import RankConditionInterface from '@interfaces/rankConditions';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import RankModel from './ranks';

class RankConditionModel extends Model<RankConditionInterface> implements RankConditionInterface {
  public id: number;
  public rankId: number;
  public orderAmountFrom: number;
  public orderAmountTo: number;
  public discountValue: number;
  public discountType: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'orderAmountFrom', 'orderAmountTo', 'discountValue', 'discountType'];

  static readonly DISCOUNT_TYPE_ENUM = { ACTIVE: 'cash', INACTIVE: 'percent' }

  static readonly hooks: Partial<ModelHooks<RankConditionModel>> = { }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = { }

  public static initialize (sequelize: Sequelize) {
    this.init(RankConditionEntity, {
      hooks: RankConditionModel.hooks,
      scopes: RankConditionModel.scopes,
      validate: RankConditionModel.validations,
      tableName: 'rank_conditions',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.belongsTo(RankModel, { as: 'rank', foreignKey: 'rankId' });
  }
}

export default RankConditionModel;
