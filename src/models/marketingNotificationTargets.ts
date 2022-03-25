import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import MarketingNotificationTargetsEntity from '@entities/marketingNotificationTargets';
import MarketingNotificationTargetsInterface from '@interfaces/marketingNotificationTargets';
import MUserTypesModel from './mUserTypes';

class MarketingNotificationTargetsModel extends Model<MarketingNotificationTargetsInterface> implements MarketingNotificationTargetsInterface {
  public id: number;
  public notificationId: number;
  public targetId: number;
  public type: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly scopes: ModelScopeOptions = {}

  public static readonly TYPE_ENUM = { USER_TYPE: 'userType' }
  static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'targetId'];

  public static initialize (sequelize: Sequelize) {
    this.init(MarketingNotificationTargetsEntity, {
      tableName: 'marketing_notification_targets',
      scopes: MarketingNotificationTargetsModel.scopes,
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.belongsTo(MUserTypesModel, { as: 'target', foreignKey: 'targetId' });
  }
}

export default MarketingNotificationTargetsModel;
