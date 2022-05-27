import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import SellerBankModel from '@models/sellerBanks';
import { Request, Response } from 'express';

class SellerBankController {
  public async index (req: Request, res: Response) {
    try {
      const sellerBanks = await SellerBankModel.scope([
        { method: ['bySeller', req.currentSeller.id] },
        { method: ['bySorting', 'isDefaultAccount', 'DESC'] },
        'withBank',
      ]).findAll();
      sendSuccess(res, { sellerBanks });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const sellerBank = await SellerBankModel.scope([
        { method: ['bySeller', req.currentSeller.id] },
        { method: ['byId', req.params.sellerBankId] },
        'withBank',
      ]).findOne();
      if (!sellerBank) return sendError(res, 404, NoData);
      sendSuccess(res, { sellerBank });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(SellerBankModel.CREATABLE_PARAMETERS).value();
      const sellerBank = await SellerBankModel.create({ ...params, sellerId: req.currentSeller.id });
      sendSuccess(res, { sellerBank });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const sellerBank = await SellerBankModel.scope([
        { method: ['bySeller', req.currentSeller.id] },
        { method: ['byId', req.params.sellerBankId] },
        'withBank',
      ]).findOne();
      if (!sellerBank) return sendError(res, 404, NoData);
      const params = req.parameters.permit(SellerBankModel.UPDATABLE_PARAMETERS).value();
      await sellerBank.update(params);
      sendSuccess(res, { sellerBank });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const sellerBank = await SellerBankModel.scope([
        { method: ['bySeller', req.currentSeller.id] },
        { method: ['byId', req.params.sellerBankId] },
        'withBank',
      ]).findOne();
      if (!sellerBank) return sendError(res, 404, NoData);
      await sellerBank.destroy();
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SellerBankController();
