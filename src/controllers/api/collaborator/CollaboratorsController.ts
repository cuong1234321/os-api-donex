import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import CollaboratorModel from '@models/collaborators';
import sequelize from '@initializers/sequelize';
import { Transaction } from 'sequelize/types';
import CollaboratorMediaModel from '@models/collaboratorMedia';

class CollaboratorController {
  public async register (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(CollaboratorModel.CREATABLE_COLLABORATOR_PARAMETERS).value();
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const collaborator = await CollaboratorModel.create(params, {
          include: [
            { model: CollaboratorMediaModel, as: 'media' },
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
}

export default new CollaboratorController();
