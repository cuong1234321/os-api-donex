import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import Settings from '@configs/settings';
import MoneyWalletChangeModel from '@models/moneyWalletChanges';
import { Op, Sequelize } from 'sequelize';
import dayjs from 'dayjs';

class MoneyWalletChangeController {
  public async index (req: Request, res: Response) {
    try {
      const { currentSeller } = req;
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(Settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const createdAtFrom = req.query.createdAtFrom ? dayjs(req.query.createdAtFrom as string).startOf('day').format() : dayjs().startOf('month').format();
      const createdAtTo = req.query.createdAtFrom ? dayjs(req.query.createdAtTo as string).endOf('day').format() : dayjs().endOf('month').format();
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        { method: ['byOwner', currentSeller.id] },
        { method: ['byCreatedAt', createdAtFrom, createdAtTo] },
        'withMutableObject',
      ];
      const { count, rows }: any = await MoneyWalletChangeModel.scope(scopes).findAndCountAll({
        limit,
        offset,
        group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('MoneyWalletChangeModel.created_at'), '%Y%m%d')],
      });
      const moneyWalletChanges = await MoneyWalletChangeModel.scope(scopes).findAll({
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn('DATE_FORMAT', Sequelize.col('MoneyWalletChangeModel.created_at'), '%Y%m%d'),
              { [Op.in]: rows.map((row: any) => dayjs(row.createdAt).format('YYYYMMDD')) },
            ),
          ],
        },
      });
      const histories: any = [];
      rows.forEach((row: any) => {
        const historyByDay = moneyWalletChanges.filter((record: any) => dayjs(record.createdAt).format('YYYYMMDD') === dayjs(row.createdAt).format('YYYYMMDD'));
        histories.push(historyByDay);
      });
      sendSuccess(res, { moneyWalletChanges: histories, pagination: { total: count.length, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new MoneyWalletChangeController();
