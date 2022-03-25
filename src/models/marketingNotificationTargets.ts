import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import MarketingNotificationTargetsEntity from '@entities/marketingNotificationTargets';
import MarketingNotificationTargetsInterface from '@interfaces/marketingNotificationTargets';

class MarketingNotificationTargetsModel extends Model<MarketingNotificationTargetsInterface> implements MarketingNotificationTargetsInterface {
  public id: number;
  public notificationId: number;
  public targetId: number;
  public type: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly scopes: ModelScopeOptions = {}

  public static readonly TYPE_ENUM = { USER_TYPE: 'userType' }

  public static initialize (sequelize: Sequelize) {
    this.init(MarketingNotificationTargetsEntity, {
      tableName: 'marketing_notification_targets',
      scopes: MarketingNotificationTargetsModel.scopes,
      sequelize,
    });
  }

  public static associate () { }
}

export default MarketingNotificationTargetsModel;
