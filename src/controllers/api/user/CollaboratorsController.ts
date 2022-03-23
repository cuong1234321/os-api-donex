import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import CollaboratorModel from '@models/collaborators';
import UserModel from '@models/users';
import sequelize from '@initializers/sequelize';
import { Transaction } from 'sequelize/types';
import ImageUploaderService from '@services/imageUploader';

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
}

export default new CollaboratorController();
