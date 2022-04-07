import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Request, Response } from 'express';
import ImageUploaderService from '@services/imageUploader';

class UserController {
  public async update (req: Request, res:Response) {
    try {
      const { currentUser } = req;
      const params = req.parameters.permit(UserModel.USER_UPDATABLE_PARAMETERS).value();
      if (currentUser.dateOfBirth) {
        delete params.dateOfBirth;
      }
      await currentUser.update(params);
      sendSuccess(res, currentUser);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadAvatar (req: Request, res: Response) {
    try {
      const { currentUser } = req;
      const avatar = await ImageUploaderService.singleUpload(req.file);
      await currentUser.update({
        avatar,
      });
      sendSuccess(res, { currentUser });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new UserController();
