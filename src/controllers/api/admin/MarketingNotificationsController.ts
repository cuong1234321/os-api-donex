import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MarketingNotificationsModel from '@models/marketingNotifications';
import { Transaction } from 'sequelize/types';
import sequelize from '@initializers/sequelize';
import MarketingNotificationTargetsModel from '@models/marketingNotificationTargets';
import settings from '@configs/settings';

class MarketingNotificationsController {
  public async index (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.limit as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const { freeWord, status, listTarget } = req.query;
      const scope: any = [
        'withOwner',
        'withNotificationTarget',
      ];
      if (status) scope.push({ method: ['byStatus', status] });
      if (listTarget) scope.push({ method: ['byTarget', listTarget] });
      if (freeWord) scope.push({ method: ['byFreeWord', freeWord] });
      const { count, rows } = await MarketingNotificationsModel.scope(scope).findAndCountAll({ limit, offset, distinct: true, col: 'MarketingNotificationsModel.id' });
      sendSuccess(res, { notifications: rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const admin = req.currentAdmin || { id: 1 };
      const marketingNotificationParams = req.parameters.permit(MarketingNotificationsModel.CREATABLE_PARAMETERS).value();
      marketingNotificationParams.ownerId = admin.id;
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const product = await MarketingNotificationsModel.create(marketingNotificationParams, {
          include: [
            { model: MarketingNotificationTargetsModel, as: 'notificationTargets' },
          ],
          transaction,
        });
        return product;
      });
      sendSuccess(res, { marketingNotification: result });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new MarketingNotificationsController();
