import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import AddressBookModel from '@models/addressBooks';
import { Request, Response } from 'express';

class AddressBookController {
  public async index (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      const addressBooks = await AddressBookModel.scope([
        { method: ['byUserAble', currentSeller.id, currentSeller.type] },
        'addressInfo',
      ]).findAll();
      sendSuccess(res, addressBooks);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      const addressBook = await AddressBookModel.scope([
        { method: ['byUserAble', currentSeller.id, currentSeller.type] },
        { method: ['byId', req.params.addressBookId] },
        'addressInfo',
      ]).findOne();
      if (!addressBook) { return sendError(res, 404, NoData); }
      sendSuccess(res, addressBook);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      const params = req.parameters.permit(AddressBookModel.CREATABLE_PARAMETERS).value();
      params.userId = currentSeller.id;
      params.userType = currentSeller.type;
      const addressBook = await AddressBookModel.create(params);
      sendSuccess(res, addressBook);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      const params = req.parameters.permit(AddressBookModel.UPDATABLE_PARAMETERS).value();
      const addressBook = await AddressBookModel.scope([
        { method: ['byUserAble', currentSeller.id, currentSeller.type] },
        { method: ['byId', req.params.addressBookId] },
      ]).findOne();
      if (!addressBook) { return sendError(res, 404, NoData); }
      await addressBook.update(params);
      sendSuccess(res, addressBook);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      const addressBook = await AddressBookModel.scope([
        { method: ['byUserAble', currentSeller.id, currentSeller.type] },
        { method: ['byId', req.params.addressBookId] },
      ]).findOne();
      if (!addressBook) { return sendError(res, 404, NoData); }
      await addressBook.destroy();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}
export default new AddressBookController();
