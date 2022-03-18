import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MarketingNotificationsModel from '@models/marketingNotifications';
import { Transaction } from 'sequelize/types';
import sequelize from '@initializers/sequelize';
import MarketingNotificationTargetsModel from '@models/marketingNotificationTargets';

class MarketingNotificationsController {
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
