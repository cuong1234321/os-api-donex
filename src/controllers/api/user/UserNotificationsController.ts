import { sendError, sendSuccess } from '@libs/response';
import UserNotificationModel from '@models/userNotifications';
import { Request, Response } from 'express';
import { NoData } from '@libs/errors';
import dayjs from 'dayjs';
import Settings from '@configs/settings';
import MUserTypeModel from '@models/mUserTypes';

class UserNotificationController {
  public async index (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.size as string || Settings.defaultPerPage, 10);
      const offset = (page - 1) * limit;
      const { rows, count } = await UserNotificationModel.scope([
        { method: ['byUser', currentUser.id] },
        { method: ['byUserType', MUserTypeModel.TYPE_ENUM.USER] },
        'withThumbnail',
        'newest',
      ]).findAndCountAll({ limit, offset });
      const notifications = await UserNotificationModel.scope([
        'withoutRead',
        { method: ['byUser', currentUser.id] },
        { method: ['byUserType', MUserTypeModel.TYPE_ENUM.USER] },
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
        { method: ['byUser', currentUser.id] },
        { method: ['byId', req.params.notificationId] },
        { method: ['byUserType', MUserTypeModel.TYPE_ENUM.USER] },
        'withThumbnail',
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
        },
      });
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new UserNotificationController();
