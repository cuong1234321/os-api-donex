import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import sequelize from '@initializers/sequelize';
import CollaboratorModel from '@models/collaborators';
import ImageUploaderService from '@services/imageUploader';
import settings from '@configs/settings';
import { FileIsNotSupport, NoData } from '@libs/errors';
import MailerService from '@services/mailer';
import CollaboratorWorkingDayModel from '@models/collaboratorWorkingDays';
import CollaboratorMediaModel from '@models/collaboratorMedia';
import { Sequelize } from 'sequelize';
import dayjs from 'dayjs';

class CollaboratorController {
  public async index (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.limit as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const { status, freeWord, type, sortOrder } = req.query;
      const orderConditions: any = [
        [Sequelize.literal('createdAt'), 'DESC'],
      ];
      if (sortOrder) orderConditions.push([Sequelize.literal('fullName'), sortOrder]);
      const scope: any = [
        { method: ['bySortOrder', orderConditions] },
      ];
      if (status) scope.push({ method: ['byStatus', status] });
      if (freeWord) scope.push({ method: ['byFreeWord', freeWord] });
      if (type) scope.push({ method: ['byType', type] });
      const { rows, count } = await CollaboratorModel.scope(scope).findAndCountAll({ limit, offset, distinct: true, col: 'CollaboratorModel.id' });
      const totalPending = await CollaboratorModel.scope([{ method: ['byStatus', CollaboratorModel.STATUS_ENUM.PENDING] }]).count();
      sendSuccess(res, { totalPending, rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const collaboratorParams = req.parameters.permit(CollaboratorModel.CREATABLE_PARAMETERS).value();
      collaboratorParams.status = CollaboratorModel.STATUS_ENUM.ACTIVE;
      const { collaboratorWorkingDays, collaboratorMedia } = req.body;
      let collaborator: any;
      await sequelize.transaction(async (transaction: Transaction) => {
        collaborator = await CollaboratorModel.create(collaboratorParams, { transaction });
        for (const element of collaboratorWorkingDays) {
          element.collaboratorId = collaborator.id;
        }
        await CollaboratorWorkingDayModel.bulkCreate(collaboratorWorkingDays, { transaction });
        for (const element of collaboratorMedia) {
          element.collaboratorId = collaborator.id;
        }
        await CollaboratorMediaModel.bulkCreate(collaboratorMedia, { transaction });
      });
      await collaborator.reloadCollaborator();
      sendSuccess(res, { collaborator });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadPaperProof (req: Request, res: Response) {
    try {
      const { collaboratorId } = req.params;
      const files: any[] = req.files as any[];
      const collaborator = await CollaboratorModel.findByPk(collaboratorId);
      let paperProofFront: string;
      let paperProofBack: string;
      for (const file of files) {
        if (file.fieldname === 'paperProofFront') {
          paperProofFront = await ImageUploaderService.singleUpload(file);
        }
        if (file.fieldname === 'paperProofBack') {
          paperProofBack = await ImageUploaderService.singleUpload(file);
        }
      }
      await collaborator.update({
        paperProofFront: paperProofFront,
        paperProofBack: paperProofBack,
      });
      await collaborator.reloadCollaborator();
      sendSuccess(res, { collaborator });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const { collaboratorId } = req.params;
      const collaborator = await CollaboratorModel.findByPk(collaboratorId);
      if (!collaborator) return sendError(res, 404, NoData);
      const collaboratorParams = req.parameters.permit(CollaboratorModel.UPDATABLE_PARAMETERS).value();
      const { collaboratorWorkingDays } = req.body;
      await sequelize.transaction(async (transaction: Transaction) => {
        await collaborator.update(collaboratorParams, { transaction });
        await collaborator.updateListCollaboratorWorkingDay(collaboratorWorkingDays, transaction);
        await collaborator.updateMedias(req.body.collaboratorMedia, transaction);
      });
      await collaborator.reloadCollaborator();
      sendSuccess(res, { collaborator });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async active (req: Request, res: Response) {
    try {
      const { collaboratorId } = req.params;
      const collaborator = await CollaboratorModel.findByPk(collaboratorId);
      if (!collaborator || collaborator.status !== CollaboratorModel.STATUS_ENUM.INACTIVE) return sendError(res, 404, NoData);
      await collaborator.update({
        status: CollaboratorModel.STATUS_ENUM.ACTIVE,
      });
      await collaborator.reloadCollaborator();
      sendSuccess(res, { collaborator });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async inactive (req: Request, res: Response) {
    try {
      const { collaboratorId } = req.params;
      const collaborator = await CollaboratorModel.findByPk(collaboratorId);
      if (!collaborator || collaborator.status !== CollaboratorModel.STATUS_ENUM.ACTIVE) return sendError(res, 404, NoData);
      await collaborator.update({
        status: CollaboratorModel.STATUS_ENUM.INACTIVE,
      });
      await collaborator.reloadCollaborator();
      sendSuccess(res, { collaborator });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const { collaboratorId } = req.params;
      const collaborator = await CollaboratorModel.scope([
        'withWorkingDay',
        'withMedia',
        'withRejectorName',
      ]).findByPk(collaboratorId);
      if (!collaborator) return sendError(res, 404, NoData);
      sendSuccess(res, { collaborator });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const { collaboratorId } = req.params;
      const collaborator = await CollaboratorModel.findByPk(collaboratorId);
      if (!collaborator) return sendError(res, 404, NoData);
      await collaborator.destroy();
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async verify (req: Request, res: Response) {
    try {
      const { collaboratorId } = req.params;
      const collaborator = await CollaboratorModel.findByPk(collaboratorId);
      if (!collaborator) return sendError(res, 404, NoData);
      await collaborator.checkStatus(CollaboratorModel.STATUS_ENUM.PENDING);
      const { username, password, defaultRank, parentId } = req.body;
      const collaboratorParams = {
        parentId,
        status: CollaboratorModel.STATUS_ENUM.ACTIVE,
        username,
        password,
        defaultRank,
      };
      await collaborator.update(collaboratorParams);
      await collaborator.reloadCollaborator();
      MailerService.sendCollaboratorLoginInfo(collaborator, collaboratorParams.password);
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async reject (req: Request, res: Response) {
    try {
      const currentAdmin = req.currentAdmin;
      const { collaboratorId } = req.params;
      const collaborator = await CollaboratorModel.findByPk(collaboratorId);
      if (!collaborator) return sendError(res, 404, NoData);
      await collaborator.checkStatus(CollaboratorModel.STATUS_ENUM.PENDING);
      const { rejectionReason } = req.body;
      const collaboratorParams = {
        rejectionReason,
        rejectorId: currentAdmin.id,
        rejectDate: dayjs(),
        status: CollaboratorModel.STATUS_ENUM.REJECTED,
      };
      await collaborator.update(collaboratorParams);
      MailerService.sendRejectCollaboratorRequest(collaborator);
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadMedia (req: Request, res: Response) {
    try {
      const collaborator = await CollaboratorModel.findByPk(req.params.collaboratorId);
      if (!collaborator) return sendError(res, 404, NoData);
      const files: any[] = req.files as any[];
      for (const file of files) {
        const attribute: any = {};
        if (file.mimetype.split('/')[0] === settings.prefix.imageMime) {
          attribute.source = await ImageUploaderService.singleUpload(file);
          attribute.collaboratorId = collaborator.id;
        } else {
          return sendError(res, 403, FileIsNotSupport);
        }
        await CollaboratorMediaModel.update(attribute, { where: { collaboratorId: collaborator.id, id: file.fieldname } });
      }
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadAvatar (req: Request, res: Response) {
    try {
      const { collaboratorId } = req.params;
      const collaborator = await CollaboratorModel.findByPk(collaboratorId);
      if (!collaborator) return sendError(res, 404, NoData);
      const avatar = await ImageUploaderService.singleUpload(req.file);
      await collaborator.update({
        avatar,
      });
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async changePassword (req: Request, res: Response) {
    try {
      const collaborator = await CollaboratorModel.findByPk(req.params.collaboratorId);
      if (!collaborator) { return sendError(res, 404, NoData); }
      const { password } = req.body;
      await collaborator.update({ password });
      MailerService.changePasswordUser(collaborator, password);
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new CollaboratorController();
