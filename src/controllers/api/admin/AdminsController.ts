import settings from '@configs/settings';
import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import AdminModel from '@models/admins';
import ImageUploaderService from '@services/imageUploader';
import MailerService from '@services/mailer';
import { Request, Response } from 'express';

class AdminController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(AdminModel.CREATABLE_PARAMETERS).value();
      params.password = settings.passwordAdminDefault;
      const admin = await AdminModel.create(params);
      MailerService.createAdmin(admin, settings.passwordAdminDefault);
      sendSuccess(res, admin);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadAvatar (req: Request, res: Response) {
    try {
      const admin = await AdminModel.findByPk(req.params.adminId);
      if (!admin) return sendError(res, 404, NoData);
      const avatar = await ImageUploaderService.singleUpload(req.file);
      await admin.update({ avatar });
      sendSuccess(res, admin);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new AdminController();
