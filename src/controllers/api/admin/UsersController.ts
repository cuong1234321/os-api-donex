import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import UserModel from '@models/users';
import { NoData } from '@libs/errors';
import ImageUploaderService from '@services/imageUploader';
import settings from '@configs/settings';
import { Sequelize } from 'sequelize';
import MailerService from '@services/mailer';
import RankModel from '@models/ranks';
import SlugGeneration from '@libs/slugGeneration';
import dayjs from 'dayjs';
import XlsxService from '@services/xlsx';

class UserController {
  public async index (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const orderConditions: any = [];
      const { freeWord, gender, status, nameOrder } = req.query;
      const scopes: any = [];
      if (freeWord) { scopes.push({ method: ['byFreeWord', freeWord] }); }
      if (gender) { scopes.push({ method: ['byGender', gender] }); }
      if (status) { scopes.push({ method: ['byStatus', status] }); }
      if (nameOrder) orderConditions.push([Sequelize.literal('lastName'), nameOrder]);
      scopes.push({ method: ['bySortOrder', orderConditions] });
      const users = await UserModel.scope(scopes).findAndCountAll({ limit, offset, distinct: true, col: 'UserModel.id' });
      sendSuccess(res, { users: users.rows, pagination: { total: users.count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(UserModel.USER_CREATABLE_PARAMETERS).value();
      params.password = settings.defaultUserPassword;
      const user = await UserModel.create(params);
      MailerService.createUser(user, settings.defaultUserPassword);
      sendSuccess(res, user);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

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
      await user.destroy();
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadAvatar (req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await UserModel.findByPk(userId);
      if (!user) return sendError(res, 404, NoData);
      const avatar = await ImageUploaderService.singleUpload(req.file);
      await user.update({
        avatar,
      });
      sendSuccess(res, { user });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const user = await UserModel.findByPk(req.params.userId);
      if (!user) { return sendError(res, 404, NoData); }
      user.setDataValue('defaultRankInfo', user.defaultRank ? await RankModel.scope([{ method: ['byType', SlugGeneration.execute(user.defaultRank)] }]).findOne() : null);
      user.setDataValue('currentRankInfo', await RankModel.scope([{ method: ['byType', SlugGeneration.execute(user.rank)] }]).findOne() || null);
      sendSuccess(res, user);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const user = await UserModel.findByPk(req.params.userId);
      if (!user) { return sendError(res, 404, NoData); }
      const params = req.parameters.permit(UserModel.UPDATABLE_PARAMETERS).value();
      await user.update(params);
      sendSuccess(res, user);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async changePassword (req: Request, res: Response) {
    try {
      const user = await UserModel.findByPk(req.params.userId);
      if (!user) { return sendError(res, 404, NoData); }
      const { password } = req.body;
      await user.update({ password });
      MailerService.changePasswordUser(user, password);
      sendSuccess(res, user);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async download (req: Request, res: Response) {
    try {
      const time = dayjs().format('DDMMYYhhmmss');
      const fileName = `Bao-cao-nguoi-dung-${time}.xlsx`;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { freeWord, gender, status } = req.query;
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
      ];
      if (freeWord) { scopes.push({ method: ['byFreeWord', freeWord] }); }
      if (gender) { scopes.push({ method: ['byGender', gender] }); }
      if (status) { scopes.push({ method: ['byStatus', status] }); }
      const users = await UserModel.scope(scopes).findAll();
      const buffer: any = await XlsxService.downloadUsers(users);
      res.writeHead(200, [
        ['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        ['Content-Disposition', 'attachment; filename=' + `${fileName}`],
      ]);
      res.end(Buffer.from(buffer, 'base64'));
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new UserController();
