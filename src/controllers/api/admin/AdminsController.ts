import settings from '@configs/settings';
import { MissingImportFile, NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import AdminModel from '@models/admins';
import ImageUploaderService from '@services/imageUploader';
import MailerService from '@services/mailer';
import { Sequelize, Transaction } from 'sequelize';
import { Request, Response } from 'express';
import AdminImporterService from '@services/adminImporter';
import dayjs from 'dayjs';
import XlsxService from '@services/xlsx';
import AdminWarehouseModel from '@models/adminWarehouses';
import sequelize from '@initializers/sequelize';

class AdminController {
  public async index (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const orderConditions: any = [];
      const { freeWord, gender, status, nameOrder } = req.query;
      const scopes: any = ['withRoleName'];
      if (freeWord) { scopes.push({ method: ['byFreeWord', freeWord] }); }
      if (gender) { scopes.push({ method: ['byGender', gender] }); }
      if (status) { scopes.push({ method: ['byStatus', status] }); }
      if (nameOrder) orderConditions.push([Sequelize.literal('lastName'), nameOrder]);
      scopes.push({ method: ['bySortOrder', orderConditions] });
      const admins = await AdminModel.scope(scopes).findAndCountAll({ limit, offset, distinct: true, col: 'AdminModel.id' });
      sendSuccess(res, { admins: admins.rows, pagination: { total: admins.count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const admin = await AdminModel.scope(['withRole', 'withWarehouses']).findByPk(req.params.adminId);
      if (!admin) { return sendError(res, 404, NoData); }
      sendSuccess(res, admin);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(AdminModel.CREATABLE_PARAMETERS).value();
      params.password = settings.passwordAdminDefault;
      const admin = await sequelize.transaction(async (transaction: Transaction) => {
        const result = await AdminModel.create(params, {
          include: [
            {
              model: AdminWarehouseModel,
              as: 'adminWarehouses',
            },
          ],
          transaction,
        });
        return result;
      });
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

  public async update (req: Request, res: Response) {
    try {
      const admin = await AdminModel.findByPk(req.params.adminId);
      if (!admin) { return sendError(res, 404, NoData); }
      const params = req.parameters.permit(AdminModel.UPDATABLE_PARAMETERS).value();
      await sequelize.transaction(async (transaction: Transaction) => {
        await admin.update(params, { transaction });
        await admin.updateWarehouses(params.adminWarehouses, transaction);
      });
      sendSuccess(res, admin);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async active (req: Request, res: Response) {
    try {
      const admin = await AdminModel.scope([
        { method: ['byId', req.params.adminId] },
        { method: ['byStatus', AdminModel.STATUS_ENUM.INACTIVE] },
      ]).findOne();
      if (!admin) {
        return sendError(res, 404, NoData);
      }
      await admin.update({ status: AdminModel.STATUS_ENUM.ACTIVE });
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async inActive (req: Request, res: Response) {
    try {
      const admin = await AdminModel.scope([
        { method: ['byId', req.params.adminId] },
        { method: ['byStatus', AdminModel.STATUS_ENUM.ACTIVE] },
      ]).findOne();
      if (!admin) {
        return sendError(res, 404, NoData);
      }
      await admin.update({ status: AdminModel.STATUS_ENUM.INACTIVE });
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async changePassword (req: Request, res: Response) {
    try {
      const admin = await AdminModel.findByPk(req.params.adminId);
      if (!admin) { return sendError(res, 404, NoData); }
      const { password } = req.body;
      await admin.update({ password });
      MailerService.changePasswordAdmin(admin, password);
      sendSuccess(res, admin);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const admin = await AdminModel.findByPk(req.params.adminId);
      if (!admin) { return sendError(res, 404, NoData); }
      await admin.destroy();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async downloadAdminTemplate (req: Request, res: Response) {
    try {
      const file = 'public/Danh-sach-nhan-vien.xlsx';
      res.download(file, 'Form tải lên nhân viên (Mẫu).xlsx');
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadAdmins (req: Request, res: Response) {
    try {
      const currentAdmin = req.currentAdmin;
      const file = req.file;
      if (file.originalname.split('.').reverse()[0] !== 'xlsx') {
        sendError(res, 400, MissingImportFile);
      }
      const adminImporter = new AdminImporterService(file);
      adminImporter.executeImport(currentAdmin.email);
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async download (req: Request, res: Response) {
    try {
      const time = dayjs().format('DD-MM-YY-hh:mm:ss');
      const fileName = `Bao-cao-nhan-vien-${time}.xlsx`;
      const admin = await AdminModel.scope(['withRole']).findAll();
      const buffer: any = await XlsxService.downloadAdmins(admin);
      res.writeHead(200, [
        ['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        ['Content-Disposition', 'attachment; filename=' + `${fileName}`],
      ]);
      res.end(Buffer.from(buffer, 'base64'));
      sendSuccess(res, admin);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new AdminController();
