import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import sequelize from '@initializers/sequelize';
import CollaboratorModel from '@models/collaborators';
import UserModel from '@models/users';
import ImageUploaderService from '@services/imageUploader';
import settings from '@configs/settings';
import { NoData } from '@libs/errors';

class CollaboratorController {
  public async index (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const limit = parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const scope: any = [
        'withUser',
      ];
      const { status, gender, freeWord } = req.query;
      if (status) scope.push({ method: ['byStatus', status] });
      if (gender) scope.push({ method: ['byGender', gender] });
      if (freeWord) scope.push({ method: ['byFreeWord', freeWord] });
      const { rows, count } = await CollaboratorModel.scope(scope).findAndCountAll({ limit, offset });
      const totalPending = await CollaboratorModel.scope([{ method: ['byStatus', 'pending'] }]).count();
      sendSuccess(res, { totalPending, rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const userParams = req.parameters.permit(CollaboratorModel.INFORMATION_PARAMETERS).value();
      userParams.status = UserModel.STATUS_ENUM.ACTIVE;
      const collaboratorParams = req.parameters.permit(CollaboratorModel.CREATABLE_PARAMETERS).value();
      collaboratorParams.status = CollaboratorModel.STATUS_ENUM.ACTIVE;
      if (collaboratorParams.type === CollaboratorModel.TYPE_ENUM.DISTRIBUTOR) collaboratorParams.parentId = null;
      let collaborator: any;
      await sequelize.transaction(async (transaction: Transaction) => {
        const user = await UserModel.create(userParams, { transaction });
        collaboratorParams.userId = user.id;
        collaborator = await CollaboratorModel.create(collaboratorParams, { transaction });
      });
      await collaborator.reload({
        include: {
          model: UserModel,
          as: 'user',
        },
      });
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
      await collaborator.reload({
        include: {
          model: UserModel,
          as: 'user',
        },
      });
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
      const user = await UserModel.findByPk(collaborator.userId);
      if (!user) return sendError(res, 404, NoData);
      const userParams = req.parameters.permit(CollaboratorModel.INFORMATION_PARAMETERS).value();
      const collaboratorParams = req.parameters.permit(CollaboratorModel.UPDATABLE_PARAMETERS).value();
      if (collaboratorParams.type === CollaboratorModel.TYPE_ENUM.DISTRIBUTOR) collaboratorParams.parentId = null;
      await sequelize.transaction(async (transaction: Transaction) => {
        await user.update(userParams, { transaction });
        await collaborator.update(collaboratorParams, { transaction });
      });
      await collaborator.reload({
        include: {
          model: UserModel,
          as: 'user',
        },
      });
      sendSuccess(res, { collaborator });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new CollaboratorController();
