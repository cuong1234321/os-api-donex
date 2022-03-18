import UserNotificationsEntity from '@entities/userNotifications';
import UserNotificationsInterface from '@interfaces/userNotifications';
import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class UserNotificationsModel extends Model<UserNotificationsInterface> implements UserNotificationsInterface {
  public id: number;
  public userId: number;
  public notificationTargetId: number;
  public title: string;
  public content: string;
  public readAt: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly hooks: Partial<ModelHooks<UserNotificationsModel>> = { }

  static readonly scopes: ModelScopeOptions = {
  }

  public static initialize (sequelize: Sequelize) {
    this.init(UserNotificationsEntity, {
      hooks: UserNotificationsModel.hooks,
      scopes: UserNotificationsModel.scopes,
      tableName: 'user_notifications',
      sequelize,
    });
  }

  public static associate () {
  }
}

export default UserNotificationsModel;
