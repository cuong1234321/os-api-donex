import { sendError, sendSuccess } from '@libs/response';
import UserNotificationModel from '@models/userNotifications';
import { Request, Response } from 'express';
import { NoData } from '@libs/errors';
import dayjs from 'dayjs';
import Settings from '@configs/settings';

class UserNotificationController {
  public async index (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.size as string || Settings.defaultPerPage, 10);
      const offset = (page - 1) * limit;
      const { type } = req.query;
      const scopes: any = [
        { method: ['byUserAble', currentUser.id, UserNotificationModel.USER_TYPE_ENUM.USER] },
        'newest',
      ];
      if (type) scopes.push({ method: ['byType', type] });
      const { rows, count } = await UserNotificationModel.scope(scopes).findAndCountAll({ limit, offset });
      const notifications = await UserNotificationModel.scope([
        'withoutRead',
        { method: ['byUserAble', currentUser.id, UserNotificationModel.USER_TYPE_ENUM.USER] },
      ]).findAll();
      sendSuccess(res, { notifications: rows, pagination: { total: count, page, perPage: limit }, totalWithoutRead: notifications.length });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      const notification = await UserNotificationModel.scope([
        { method: ['byId', req.params.notificationId] },
        { method: ['byUserAble', currentUser.id, UserNotificationModel.USER_TYPE_ENUM.USER] },
      ]).findOne();
      if (!notification) return sendError(res, 404, NoData);
      sendSuccess(res, { notification });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async read (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      const notification = await UserNotificationModel.scope([
        { method: ['byUser', currentUser.id] },
        { method: ['byId', req.params.notificationId] },
      ]).findOne();
      if (!notification) return sendError(res, 404, NoData);
      await notification.update({ readAt: dayjs() });
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async readAll (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      await UserNotificationModel.update(
        { readAt: dayjs() },
        {
          where: {
            userId: currentUser.id,
            userType: UserNotificationModel.USER_TYPE_ENUM.USER,
          },
        },
      );
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      const notification = await UserNotificationModel.scope([
        { method: ['byUser', currentUser.id] },
        { method: ['byId', req.params.notificationId] },
      ]).findOne();
      if (!notification) return sendError(res, 404, NoData);
      await notification.destroy();
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async deleteAll (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      await UserNotificationModel.destroy({
        where: {
          userId: currentUser.id,
          userType: UserNotificationModel.USER_TYPE_ENUM.USER,
        },
      });
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new UserNotificationController();
