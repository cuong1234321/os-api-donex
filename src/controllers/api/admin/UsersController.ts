import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import sequelize from '@initializers/sequelize';
import CollaboratorModel from '@models/collaborators';
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

  public async delete (req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await UserModel.findByPk(userId);
      if (!user) return sendError(res, 404, NoData);
      await user.checkStatus(CollaboratorModel.STATUS_ENUM.INACTIVE);
      const collaborator = await CollaboratorModel.scope([
        { method: ['byUserId', userId] },
      ]).findOne();
      if (!collaborator) {
        await user.destroy();
      } else {
        await sequelize.transaction(async (transaction: Transaction) => {
          await user.destroy({ transaction });
          await collaborator.destroy({ transaction });
        });
      }
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new UserController();
