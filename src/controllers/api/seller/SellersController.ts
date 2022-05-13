import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import sequelize from '@initializers/sequelize';
import CollaboratorModel from '@models/collaborators';
import ImageUploaderService from '@services/imageUploader';
import settings from '@configs/settings';
import { FileIsNotSupport } from '@libs/errors';
import CollaboratorMediaModel from '@models/collaboratorMedia';

class SellerController {
  public async update (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      const params = req.parameters.permit(CollaboratorModel.SELLER_UPDATABLE_PARAMETERS).value();
      const { collaboratorWorkingDays } = req.body;
      await sequelize.transaction(async (transaction: Transaction) => {
        await currentSeller.update(params, { transaction });
        await currentSeller.updateListCollaboratorWorkingDay(collaboratorWorkingDays, transaction);
        await currentSeller.updateMedias(req.body.collaboratorMedia, transaction);
      });
      await currentSeller.reloadCollaborator();
      sendSuccess(res, currentSeller);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadPaperProof (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      const files: any = req.files as any;
      const paperProofFront = files.paperProofFront ? await ImageUploaderService.singleUpload(files.paperProofFront[0]) : undefined;
      const paperProofBack = files.paperProofBack ? await ImageUploaderService.singleUpload(files.paperProofBack[0]) : undefined;
      await currentSeller.update({
        paperProofFront: paperProofFront,
        paperProofBack: paperProofBack,
      });
      await currentSeller.reloadCollaborator();
      sendSuccess(res, currentSeller);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadMedia (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      const files: any[] = req.files as any[];
      for (const file of files) {
        const attribute: any = {};
        if (file.mimetype.split('/')[0] === settings.prefix.imageMime) {
          attribute.source = await ImageUploaderService.singleUpload(file);
          attribute.collaboratorId = currentSeller.id;
        } else {
          return sendError(res, 403, FileIsNotSupport);
        }
        await CollaboratorMediaModel.update(attribute, { where: { collaboratorId: currentSeller.id, id: file.fieldname } });
      }
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadAvatar (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      const avatar = await ImageUploaderService.singleUpload(req.file);
      await currentSeller.update({
        avatar,
      },
      { validator: false });
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SellerController();
