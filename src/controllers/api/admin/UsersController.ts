import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import UserModel from '@models/users';
import { NoData } from '@libs/errors';

class UserController {
  public async active (req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await UserModel.findByPk(userId);
      if (!user || user.status !== UserModel.STATUS_ENUM.INACTIVE) return sendError(res, 404, NoData);
      await user.update({
        status: UserModel.STATUS_ENUM.ACTIVE,
      });
      sendSuccess(res, { user });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async inactive (req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await UserModel.findByPk(userId);
      if (!user || user.status !== UserModel.STATUS_ENUM.ACTIVE) return sendError(res, 404, NoData);
      await user.update({
        status: UserModel.STATUS_ENUM.INACTIVE,
      });
      sendSuccess(res, { user });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new UserController();
