import settings from '@configs/settings';
import { sendError, sendSuccess } from '@libs/response';
import HistoryEarnedPointModel from '@models/historyEarnedPoints';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { Op, Sequelize } from 'sequelize';

class HistoryEarnedPointController {
  public async index (req: Request, res: Response) {
    try {
      const { currentUser } = req;
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const createdAtFrom = req.query.createdAtFrom ? dayjs(req.query.createdAtFrom as string).startOf('day').format() : dayjs().startOf('month').format();
      const createdAtTo = req.query.createdAtFrom ? dayjs(req.query.createdAtTo as string).endOf('day').format() : dayjs().endOf('month').format();
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        { method: ['byUser', currentUser.id] },
        { method: ['byCreatedAt', createdAtFrom, createdAtTo] },
        'withMutableObject',
      ];
      const { count, rows }: any = await HistoryEarnedPointModel.scope(scopes).findAndCountAll({
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
      sendSuccess(res, { historyEarnedPoints, pagination: { total: count.length, page, perPage: limit } });
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new HistoryEarnedPointController();
