import { InvalidPassword, invalidParameter } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import AdminModel from '@models/admins';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

class AccountController {
  public async update (req: Request, res:Response) {
    try {
      const { currentAdmin } = req;
      const params = req.parameters.permit(AdminModel.ADMIN_UPDATABLE_PARAMETERS).value();
      await currentAdmin.update(params);
      sendSuccess(res, currentAdmin);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async changePassword (req: Request, res: Response) {
    try {
      const currentAdmin = req.currentAdmin;
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const checkOldPassword = await bcrypt.compare(oldPassword, currentAdmin.password);
      if (!checkOldPassword) { return sendError(res, 400, InvalidPassword); }
      if (!newPassword || newPassword !== confirmPassword) { return sendError(res, 400, invalidParameter); }
      await AdminModel.update({ password: newPassword }, { where: { id: currentAdmin.id }, individualHooks: true });
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new AccountController();
