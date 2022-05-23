import settings from '@configs/settings';
import { sendError, sendSuccess } from '@libs/response';
import HistoryEarnedPointModel from '@models/historyEarnedPoints';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { Op, Sequelize } from 'sequelize';

class HistoryEarnedPointController {
  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (page - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { userId, userType, fromDate, toDate, type } = req.query;
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        { method: ['byCreatedAt', fromDate, toDate] },
        { method: ['byUser', userId, userType] },
      ];
      if (type) scopes.push({ method: ['byType', type] });
      const { rows, count } = await HistoryEarnedPointModel.scope(scopes).findAndCountAll({
        limit,
        offset,
        group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('HistoryEarnedPointModel.createdAt'), '%Y%m%d')],
      });
      const historyEarnedPoints = await HistoryEarnedPointModel.scope(scopes).findAll({
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn('DATE_FORMAT', Sequelize.col('HistoryEarnedPointModel.createdAt'), '%Y%m%d'),
              { [Op.in]: rows.map((row: any) => dayjs(row.createdAt).format('YYYYMMDD')) },
            ),
          ],
        },
      });
      const histories: any = [];
      rows.forEach((row: any) => {
        const historyByDay = historyEarnedPoints.filter((record: any) => dayjs(record.createdAt).format('YYYYMMDD') === dayjs(row.createdAt).format('YYYYMMDD'));
        histories.push(historyByDay);
      });
      sendSuccess(res, { historyEarnedPoints: histories, pagination: { total: count.length, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new HistoryEarnedPointController();
