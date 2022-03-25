import MarketingNotificationsEntity from '@entities/marketingNotifications';
import MarketingNotificationsInterface from '@interfaces/marketingNotifications';
import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import dayjs from 'dayjs';
import SendSystemNotificationWorker from '@workers/SendSystemNotification';
import MarketingNotificationTargetInterface from '@interfaces/marketingNotificationTargets';
import UserNotificationsModel from './userNotifications';
import UserModel from './users';
import CollaboratorModel from './collaborators';
import MarketingNotificationTargetsModel from './marketingNotificationTargets';
import MUserTypeModel from './mUserTypes';

class MarketingNotificationsModel extends Model<MarketingNotificationsInterface> implements MarketingNotificationsInterface {
  public id: number;
  public ownerId: number;
  public title: string;
  public content: string;
  public link: string;
  public isSentImmediately: boolean;
  public sendAt: Date;
  public status: string;
  public jobId: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt: Date;

  public notificationTargets?: MarketingNotificationTargetInterface[];

  public static readonly STATUS_ENUM = { PENDING: 'pending', SENDED: 'sended' }

  public static readonly CREATABLE_PARAMETERS = [
    'title', 'content', 'link', 'isSentImmediately', 'sendAt',
    { notificationTargets: ['targetId', 'type'] },
  ]

  static readonly hooks: Partial<ModelHooks<MarketingNotificationsModel>> = {
    async afterSave (record) {
      if (record.isSentImmediately) {
        record.sendNotifications();
      } else {
        await record.scheduleDelivery();
      }
    },
  }

  static readonly scopes: ModelScopeOptions = {
  }

  public async sendNotifications () {
    if (this.status === MarketingNotificationsModel.STATUS_ENUM.SENDED) return;
    await this.reloadNotification();
    let notifications: any[] = [];
    if (this.notificationTargets.find((element: any) => element.target.name === 'user' &&
    element.type === MarketingNotificationTargetsModel.TYPE_ENUM.USER_TYPE)) {
      const users: any = await UserModel.findAll();
      const userNotifications = users.map((user: any) => {
        return {
          userId: user.id as number,
          notificationTargetId: this.notificationTargets.find((element: any) => element.target.name === 'user').id,
          title: this.title,
          content: this.content,
        };
      });
      notifications = notifications.concat([...userNotifications]);
    }
    if (this.notificationTargets.find((element: any) => element.target.name === 'collaborator' &&
    element.type === MarketingNotificationTargetsModel.TYPE_ENUM.USER_TYPE)) {
      const collaborators: any = await CollaboratorModel.scope([
        { method: ['byType', CollaboratorModel.TYPE_ENUM.COLLABORATOR] },
        'withUser',
      ]).findAll();
      const userNotifications = collaborators.map((collaborator: any) => {
        return {
          userId: collaborator.user.id as number,
          notificationTargetId: this.notificationTargets.find((element: any) => element.target.name === 'collaborator').id,
          title: this.title,
          content: this.content,
        };
      });
      notifications = notifications.concat([...userNotifications]);
    }
    if (this.notificationTargets.find((element: any) => element.target.name === 'agency' &&
    element.type === MarketingNotificationTargetsModel.TYPE_ENUM.USER_TYPE)) {
      const agency: any = await CollaboratorModel.scope([
        { method: ['byType', CollaboratorModel.TYPE_ENUM.AGENCY] },
        'withUser',
      ]).findAll();
      const userNotifications = agency.map((agency: any) => {
        return {
          userId: agency.user.id as number,
          notificationTargetId: this.notificationTargets.find((element: any) => element.target.name === 'agency').id,
          title: this.title,
          content: this.content,
        };
      });
      notifications = notifications.concat([...userNotifications]);
    }
    if (this.notificationTargets.find((element: any) => element.target.name === 'sendToDistributor' &&
    element.type === MarketingNotificationTargetsModel.TYPE_ENUM.USER_TYPE)) {
      const distributors: any = await CollaboratorModel.scope([
        { method: ['byType', CollaboratorModel.TYPE_ENUM.DISTRIBUTOR] },
        'withUser',
      ]).findAll();
      const userNotifications = distributors.map((distributor: any) => {
        return {
          userId: distributor.user.id as number,
          notificationTargetId: this.notificationTargets.find((element: any) => element.target.name === 'sendToDistributor').id,
          title: this.title,
          content: this.content,
        };
      });
      notifications = notifications.concat([...userNotifications]);
    }
    await UserNotificationsModel.bulkCreate(notifications);
    await this.update({
      sendAt: dayjs(),
      status: MarketingNotificationsModel.STATUS_ENUM.SENDED,
    },
    { hooks: false });
  }

  public async scheduleDelivery () {
    if (this.sendAt) {
      const sendNotifyWorkerInstance = new SendSystemNotificationWorker(this);
      if (this.jobId) await sendNotifyWorkerInstance.cancelJob();
      const job = await sendNotifyWorkerInstance.scheduleJob();
      await this.update({ jobId: job.id as number }, { hooks: false });
    }
  }

  public async reloadNotification () {
    await this.reload({
      include: {
        model: MarketingNotificationTargetsModel,
        as: 'notificationTargets',
        include: [
          { model: MUserTypeModel, as: 'target' },
        ],
      },
    });
  }

  public static initialize (sequelize: Sequelize) {
    this.init(MarketingNotificationsEntity, {
      hooks: MarketingNotificationsModel.hooks,
      scopes: MarketingNotificationsModel.scopes,
      tableName: 'marketing_notifications',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.hasMany(MarketingNotificationTargetsModel, { as: 'notificationTargets', foreignKey: 'notificationId', onDelete: 'CASCADE', hooks: true });
  }
}

export default MarketingNotificationsModel;
