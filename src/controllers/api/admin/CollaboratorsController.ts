import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import sequelize from '@initializers/sequelize';
import CollaboratorModel from '@models/collaborators';
import UserModel from '@models/users';
import ImageUploaderService from '@services/imageUploader';

class CollaboratorController {
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
}

export default new CollaboratorController();
