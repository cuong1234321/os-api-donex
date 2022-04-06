import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import VoucherModel from '@models/vouchers';
import settings from '@configs/settings';

class VoucherController {
  public async index (req: Request, res: Response) {
    try {
      const { currentUser } = req;
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
      sendSuccess(res, { vouchers: rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new VoucherController();
