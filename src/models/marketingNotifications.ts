import MarketingNotificationsEntity from '@entities/marketingNotifications';
import MarketingNotificationsInterface from '@interfaces/marketingNotifications';
import { Model, ModelScopeOptions, Op, Sequelize, Transaction } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import dayjs from 'dayjs';
import SendSystemNotificationWorker from '@workers/SendSystemNotification';
import MarketingNotificationTargetInterface from '@interfaces/marketingNotificationTargets';
import UserNotificationsModel from './userNotifications';
import UserModel from './users';
import CollaboratorModel from './collaborators';
import MarketingNotificationTargetsModel from './marketingNotificationTargets';
import MUserTypeModel from './mUserTypes';
import AdminModel from './admins';

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
  public thumbnail: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt: Date;

  public notificationTargets?: MarketingNotificationTargetInterface[];

  public static readonly STATUS_ENUM = { PENDING: 'pending', SENDED: 'sended' }

  public static readonly CREATABLE_PARAMETERS = [
    'title', 'content', 'link', 'isSentImmediately', 'sendAt',
    { notificationTargets: ['targetId', 'type'] },
  ]

  public static readonly UPDATABLE_PARAMETERS = [
    'title', 'content', 'link', 'sendAt',
    { notificationTargets: ['id', 'targetId'] },
  ]

  static readonly hooks: Partial<ModelHooks<MarketingNotificationsModel>> = {
    async afterSave (record) {
      if (record.isSentImmediately) {
        record.sendNotifications();
      } else {
        record.scheduleDelivery();
      }
    },
    async afterDestroy (record) {
      await MarketingNotificationTargetsModel.destroy({ where: { notificationId: record.id }, individualHooks: true });
    },
  }

  static readonly scopes: ModelScopeOptions = {
    byStatus (status) {
      return {
        where: { status },
      };
    },
    byTarget (listTarget) {
      const arrTarget = listTarget.split(',');
      return {
        include: [{
          model: MarketingNotificationTargetsModel,
          as: 'notificationTargets',
          where: {
            targetId: {
              [Op.in]: arrTarget,
            },
          },
        }],
      };
    },
    byFreeWord (freeWord) {
      return {
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${freeWord || ''}%` } },
            {
              ownerId: {
                [Op.in]: Sequelize.literal(`(SELECT id FROM admins WHERE deletedAt IS NULL AND fullName LIKE '%${freeWord}%')`),
              },
            },
          ],
        },
      };
    },
    bySortOrder (orderConditions) {
      return {
        order: orderConditions,
      };
    },
    withOwner () {
      return {
        include: {
          model: AdminModel,
          as: 'owner',
          attributes: ['fullName'],
        },
      };
    },
    withNotificationTarget () {
      return {
        include: [{
          model: MarketingNotificationTargetsModel,
          as: 'notificationTargets',
          include: [{
            model: MUserTypeModel,
            as: 'target',
            attributes: ['name'],
          }],
        }],
      };
    },
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
          userType: UserNotificationsModel.USER_TYPE_ENUM.USER,
          thumbnail: this.thumbnail,
          notificationTargetId: this.notificationTargets.find((element: any) => element.target.name === 'user').id,
          type: UserNotificationsModel.TYPE_ENUM.SYSTEM,
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
      ]).findAll();
      const userNotifications = collaborators.map((collaborator: any) => {
        return {
          userId: collaborator.id as number,
          userType: UserNotificationsModel.USER_TYPE_ENUM.COLLABORATOR,
          thumbnail: this.thumbnail,
          notificationTargetId: this.notificationTargets.find((element: any) => element.target.name === 'collaborator').id,
          type: UserNotificationsModel.TYPE_ENUM.SYSTEM,
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
      ]).findAll();
      const userNotifications = agency.map((agency: any) => {
        return {
          userId: agency.id as number,
          userType: UserNotificationsModel.USER_TYPE_ENUM.AGENCY,
          thumbnail: this.thumbnail,
          notificationTargetId: this.notificationTargets.find((element: any) => element.target.name === 'agency').id,
          type: UserNotificationsModel.TYPE_ENUM.SYSTEM,
          title: this.title,
          content: this.content,
        };
      });
      notifications = notifications.concat([...userNotifications]);
    }
    if (this.notificationTargets.find((element: any) => element.target.name === 'distributor' &&
    element.type === MarketingNotificationTargetsModel.TYPE_ENUM.USER_TYPE)) {
      const distributors: any = await CollaboratorModel.scope([
        { method: ['byType', CollaboratorModel.TYPE_ENUM.DISTRIBUTOR] },
      ]).findAll();
      const userNotifications = distributors.map((distributor: any) => {
        return {
          userId: distributor.id as number,
          userType: UserNotificationsModel.USER_TYPE_ENUM.DISTRIBUTOR,
          thumbnail: this.thumbnail,
          notificationTargetId: this.notificationTargets.find((element: any) => element.target.name === 'distributor').id,
          type: UserNotificationsModel.TYPE_ENUM.SYSTEM,
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
      await this.reloadNotification();
      const sendNotifyWorkerInstance = new SendSystemNotificationWorker(this);
      if (this.jobId) await sendNotifyWorkerInstance.cancelJob();
      const job = await sendNotifyWorkerInstance.scheduleJob();
      await this.update({ jobId: job.id as number }, { hooks: false });
    }
  }

  public async updateNotificationTarget (notificationTargets: any[], transaction?: Transaction) {
    if (!notificationTargets) return;
    notificationTargets.forEach((record: any) => {
      record.notificationId = this.id;
    });
    const results = await MarketingNotificationTargetsModel.bulkCreate(notificationTargets, {
      updateOnDuplicate: MarketingNotificationTargetsModel.UPDATABLE_ON_DUPLICATE_PARAMETERS as (keyof MarketingNotificationTargetInterface)[],
      individualHooks: true,
      transaction,
    });
    await MarketingNotificationTargetsModel.destroy({
      where: { notificationId: this.id, id: { [Op.notIn]: results.map((notificationTarget) => notificationTarget.id) } },
      individualHooks: true,
      transaction,
    });
  }

  public async cancelDelivery () {
    const sendNotifyWorkerInstance = new SendSystemNotificationWorker(this);
    if (this.jobId) {
      await sendNotifyWorkerInstance.cancelJob();
    }
  }

  public async reloadNotification () {
    await this.reload({
      include: [
        {
          model: MarketingNotificationTargetsModel,
          as: 'notificationTargets',
          include: [
            { model: MUserTypeModel, as: 'target', required: false },
          ],
          required: false,
        },
        {
          model: AdminModel,
          as: 'owner',
          attributes: ['fullName'],
          required: false,
        },
      ],
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
    this.belongsTo(AdminModel, { as: 'owner', foreignKey: 'ownerId' });
  }
}

export default MarketingNotificationsModel;
