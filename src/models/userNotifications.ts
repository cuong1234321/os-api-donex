import UserNotificationsEntity from '@entities/userNotifications';
import UserNotificationsInterface from '@interfaces/userNotifications';
import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import MarketingNotificationTargetsModel from './marketingNotificationTargets';
import MUserTypesModel from './mUserTypes';

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
    byId (id) {
      return {
        where: { id },
      };
    },
    byUser (userId) {
      return {
        where: { userId },
      };
    },
    byUserType (name) {
      return {
        include: [
          {
            model: MarketingNotificationTargetsModel,
            as: 'notificationTarget',
            required: true,
            include: [
              {
                model: MUserTypesModel,
                as: 'target',
                required: true,
                where: {
                  name: name,
                },
              },
            ],
          },
        ],
      };
    },
    withThumbnail () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT thumbnail FROM marketing_notifications INNER JOIN marketing_notification_targets ' +
              'ON marketing_notification_targets.notificationId = marketing_notifications.id INNER JOIN user_notifications ' +
              'ON user_notifications.notificationTargetId = marketing_notification_targets.id WHERE user_notifications.id = UserNotificationsModel.id)'),
              'thumbnail',
            ],
          ],
        },
      };
    },
    newest () {
      return {
        order: [['createdAt', 'DESC']],
      };
    },
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
    this.belongsTo(MarketingNotificationTargetsModel, { as: 'notificationTarget', foreignKey: 'notificationTargetId' });
  }
}

export default UserNotificationsModel;
