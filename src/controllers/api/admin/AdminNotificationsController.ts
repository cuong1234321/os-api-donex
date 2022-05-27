import { sendError, sendSuccess } from '@libs/response';
import UserNotificationModel from '@models/userNotifications';
import { Request, Response } from 'express';
import { NoData } from '@libs/errors';
import dayjs from 'dayjs';
import Settings from '@configs/settings';

class AdminNotificationController {
  public async index (req: Request, res: Response) {
    try {
      const currentAdmin = req.currentAdmin;
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.size as string || Settings.defaultPerPage, 10);
      const offset = (page - 1) * limit;
      const { rows, count } = await UserNotificationModel.scope([
        { method: ['byUserAble', currentAdmin.id, UserNotificationModel.USER_TYPE_ENUM.ADMIN] },
        'newest',
      ]).findAndCountAll({ limit, offset });
      const notifications = await UserNotificationModel.scope([
        'withoutRead',
        { method: ['byUserAble', currentAdmin.id, UserNotificationModel.USER_TYPE_ENUM.ADMIN] },
      ]).findAll();
      sendSuccess(res, { notifications: rows, pagination: { total: count, page, perPage: limit }, totalWithoutRead: notifications.length });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const currentAdmin = req.currentAdmin;
      const notification = await UserNotificationModel.scope([
        { method: ['byId', req.params.notificationId] },
        { method: ['byUserAble', currentAdmin.id, UserNotificationModel.USER_TYPE_ENUM.ADMIN] },
      ]).findOne();
      if (!notification) return sendError(res, 404, NoData);
      sendSuccess(res, { notification });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async read (req: Request, res: Response) {
    try {
      const currentAdmin = req.currentAdmin;
      const notification = await UserNotificationModel.scope([
        { method: ['byUser', currentAdmin.id] },
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
      const currentAdmin = req.currentAdmin;
      await UserNotificationModel.update(
        { readAt: dayjs() },
        {
          where: {
            userId: currentAdmin.id,
            userType: UserNotificationModel.USER_TYPE_ENUM.ADMIN,
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
      const currentAdmin = req.currentAdmin;
      const notification = await UserNotificationModel.scope([
        { method: ['byUser', currentAdmin.id] },
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
      const currentAdmin = req.currentAdmin;
      await UserNotificationModel.destroy({
        where: {
          userId: currentAdmin.id,
          userType: UserNotificationModel.USER_TYPE_ENUM.ADMIN,
        },
      });
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new AdminNotificationController();
