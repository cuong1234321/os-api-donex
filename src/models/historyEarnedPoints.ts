import HistoryEarnedPointEntity from '@entities/historyEarnedPoints';
import HistoryEarnedPointInterface from '@interfaces/historyEarnedPoints';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import CollaboratorModel from './collaborators';
import OrderModel from './orders';
import RatingModel from './ratings';
import UserModel from './users';

class HistoryEarnedPointModel extends Model<HistoryEarnedPointInterface> implements HistoryEarnedPointInterface {
  public id: number;
  public userId: number;
  public userType: string;
  public type: string;
  public mutableId: number;
  public mutableType: string;
  public point: number;
  public isAlreadyAlert: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly TYPE_ENUM = { SUBTRACT: 'subtract', ADD: 'add' }
  static readonly MUTABLE_TYPE = { ORDER: 'order', RATING_REWARD: 'ratingReward' }
  static readonly USER_TYPE = { USER: 'user', COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor' }

  static readonly hooks: Partial<ModelHooks<HistoryEarnedPointModel>> = {
    async afterCreate (record) {
      await record.updateAccumulatedMoney();
    },
  }

  static readonly validations: ModelValidateOptions = {
    withMutableObject () {
      return {
        include: [
          { model: OrderModel, as: 'order' },
          { model: RatingModel, as: 'rating' },
          { model: UserModel, as: 'user' },
        ],
      };
    },
  }

  private async updateAccumulatedMoney () {
    let user: any;
    switch (this.userType) {
      case HistoryEarnedPointModel.USER_TYPE.USER:
        user = await UserModel.findByPk(this.userId);
        break;
      case HistoryEarnedPointModel.USER_TYPE.COLLABORATOR:
        user = await CollaboratorModel.scope([
          { method: ['byId', this.userId] },
          { method: ['byType', HistoryEarnedPointModel.USER_TYPE.COLLABORATOR] },
        ]).findOne();
        break;
      case HistoryEarnedPointModel.USER_TYPE.AGENCY:
        user = await CollaboratorModel.scope([
          { method: ['byId', this.userId] },
          { method: ['byType', HistoryEarnedPointModel.USER_TYPE.AGENCY] },
        ]).findOne();
        break;
      case HistoryEarnedPointModel.USER_TYPE.DISTRIBUTOR:
        user = await CollaboratorModel.scope([
          { method: ['byId', this.userId] },
          { method: ['byType', HistoryEarnedPointModel.USER_TYPE.DISTRIBUTOR] },
        ]).findOne();
        break;
      default:
        break;
    }
    await user.update({ coinReward: user.coinReward + this.point });
  }

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

  public static associate () {
    this.belongsTo(OrderModel, { as: 'order', foreignKey: 'mutableId' });
    this.belongsTo(RatingModel, { as: 'rating', foreignKey: 'mutableId' });
    this.belongsTo(UserModel, { as: 'user', foreignKey: 'mutableId' });
  }
}

export default HistoryEarnedPointModel;
