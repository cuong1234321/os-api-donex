import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import VoucherModel from '@models/vouchers';
import settings from '@configs/settings';
import UserModel from '@models/users';
import RankModel from '@models/ranks';

class VoucherController {
  public async index (req: Request, res: Response) {
    try {
      const { currentUser } = req;
      const defaultVoucher: any = [];
      let systemRankPromotion: any = {};
      const donexBirthday: any = {};
      const userBirthDay: any = {};
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { status } = req.query;
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        { method: ['byRecipient', currentUser.id] },
        { method: ['byRecipientType', VoucherModel.RECIPIENT_TYPE_ENUM.USER] },
        'withApplication',
      ];
      if (status) scopes.push({ method: ['byStatus', status] });
      const { count, rows } = await VoucherModel.scope(scopes).findAndCountAll({ limit, offset });
      if (currentUser.rank === UserModel.RANK_ENUM.VIP) {
        systemRankPromotion = (await RankModel.findOrCreate({
          where: { },
          defaults: { id: undefined },
        }))[0];
        systemRankPromotion.setDataValue('conditions', await systemRankPromotion.getConditions());
      }
      defaultVoucher.push({ systemRankPromotion: systemRankPromotion });
      defaultVoucher.push({ donexBirthday: donexBirthday });
      defaultVoucher.push({ userBirthDay: userBirthDay });
      sendSuccess(res, { vouchers: rows, defaultVoucher, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new VoucherController();
