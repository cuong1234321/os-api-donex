import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import AddressBookModel from '@models/addressBooks';
import { Request, Response } from 'express';

class AddressBookController {
  public async index (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      const addressBooks = await AddressBookModel.scope([
        { method: ['byUserAble', currentUser.id, AddressBookModel.USER_TYPE_ENUM.USER] },
        'addressInfo',
        'withMisaCode',
      ]).findAll();
      sendSuccess(res, addressBooks);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      const addressBook = await AddressBookModel.scope([
        { method: ['byUserAble', currentUser.id, AddressBookModel.USER_TYPE_ENUM.USER] },
        { method: ['byId', req.params.addressBookId] },
        'addressInfo',
        'withMisaCode',
      ]).findOne();
      if (!addressBook) { return sendError(res, 404, NoData); }
      sendSuccess(res, addressBook);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      const params = req.parameters.permit(AddressBookModel.CREATABLE_PARAMETERS).value();
      params.userId = currentUser.id;
      params.userType = AddressBookModel.USER_TYPE_ENUM.USER;
      const addressBook = await AddressBookModel.create(params);
      sendSuccess(res, addressBook);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      const params = req.parameters.permit(AddressBookModel.UPDATABLE_PARAMETERS).value();
      const addressBook = await AddressBookModel.scope([
        { method: ['byUserAble', currentUser.id, AddressBookModel.USER_TYPE_ENUM.USER] },
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
      const currentUser = req.currentUser;
      const addressBook = await AddressBookModel.scope([
        { method: ['byUserAble', currentUser.id, AddressBookModel.USER_TYPE_ENUM.USER] },
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
