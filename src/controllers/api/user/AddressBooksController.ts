import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import AddressBookModel from '@models/addressBooks';
import { Request, Response } from 'express';

class AddressController {
  public async create (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser || { id: '123' };
      const params = req.parameters.permit(AddressBookModel.CREATABLE_PARAMETERS).value();
      params.userId = currentUser.id;
      const addressBook = await AddressBookModel.create(params);
      sendSuccess(res, addressBook);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser || { id: '123' };
      const params = req.parameters.permit(AddressBookModel.UPDATABLE_PARAMETERS).value();
      const addressBook = await AddressBookModel.scope([
        { method: ['byUser', currentUser.id] },
        { method: ['byId', req.params.addressBookId] },
      ]).findOne();
      if (!addressBook) { return sendError(res, 404, NoData); }
      await addressBook.update(params);
      sendSuccess(res, addressBook);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}
export default new AddressController();
