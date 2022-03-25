import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import CollaboratorModel from '@models/collaborators';
import UserModel from '@models/users';
import sequelize from '@initializers/sequelize';
import { Transaction } from 'sequelize/types';
import ImageUploaderService from '@services/imageUploader';
import { NoData } from '@libs/errors';
import CollaboratorMediaModel from '@models/collaboratorMedia';

class CollaboratorController {
  public async register (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(UserModel.CREATABLE_COLLABORATOR_PARAMETERS).value();
      params.status = UserModel.STATUS_ENUM.INACTIVE;
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const collaborator = await UserModel.create(params, {
          include: [
            { model: CollaboratorModel, as: 'collaborator' },
          ],
          transaction,
        });
        return collaborator;
      });
      sendSuccess(res, { collaborator: result });
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

  public async index (req: Request, res: Response) {
    try {
      const collaborators = await CollaboratorModel.scope([
        { method: ['byStatus', CollaboratorModel.STATUS_ENUM.ACTIVE] },
        { method: ['byType', req.query.type] },
        'withoutChildren',
        'withUser',
      ]).findAll();
      sendSuccess(res, collaborators);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const collaborator = await CollaboratorModel.scope([
        { method: ['byId', req.params.collaboratorId] },
        { method: ['byStatus', CollaboratorModel.STATUS_ENUM.ACTIVE] },
        'withoutChildren',
        'withUser',
        'addressInfo',
      ]).findOne();
      if (!collaborator) { return sendError(res, 404, NoData); }
      sendSuccess(res, collaborator);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadCollaboratorMedia (req: Request, res: Response) {
    try {
      const { collaboratorId } = req.params;
      const files: any = req.files as any[];
      const collaborator = await CollaboratorModel.findByPk(collaboratorId);
      if (!collaborator) { return sendError(res, 404, NoData); }
      for (const file of files) {
        const params: any = {
          collaboratorId,
          type: file.fieldname,
          source: await ImageUploaderService.singleUpload(file),
        };
        await CollaboratorMediaModel.create(params);
      }
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new CollaboratorController();
