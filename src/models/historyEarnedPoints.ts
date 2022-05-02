import HistoryEarnedPointEntity from '@entities/historyEarnedPoints';
import HistoryEarnedPointInterface from '@interfaces/historyEarnedPoints';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class HistoryEarnedPointModel extends Model<HistoryEarnedPointInterface> implements HistoryEarnedPointInterface {
  public id: number;
  public userId: number;
  public userType: string;
  public applicationAbleId: number;
  public applicationAbleType: string;
  public point: number;
  public isAlreadyAlert: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly hooks: Partial<ModelHooks<HistoryEarnedPointModel>> = {
  }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = {}

  public static initialize (sequelize: Sequelize) {
    this.init(HistoryEarnedPointEntity, {
      tableName: 'history_earned_points',
      scopes: HistoryEarnedPointModel.scopes,
      hooks: HistoryEarnedPointModel.hooks,
      validate: HistoryEarnedPointModel.validations,
      sequelize,
      paranoid: true,
    });
  }

  public static associate () { }
}

export default HistoryEarnedPointModel;
