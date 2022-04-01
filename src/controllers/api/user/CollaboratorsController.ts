import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import CollaboratorModel from '@models/collaborators';
import { NoData } from '@libs/errors';

class CollaboratorController {
  public async index (req: Request, res: Response) {
    try {
      const { freeWord } = req.query;
      const scopes: any = [
        { method: ['byStatus', CollaboratorModel.STATUS_ENUM.ACTIVE] },
        { method: ['byType', req.query.type] },
        'withoutParent',
      ];
      if (freeWord) scopes.push({ method: ['byFreeWordStore', freeWord] });
      const collaborators = await CollaboratorModel.scope(scopes).findAll({ attributes: ['id', 'fullName'] });
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
        'withoutParent',
        'addressInfo',
        'withWorkingDay',
      ]).findOne();
      if (!collaborator) { return sendError(res, 404, NoData); }
      ['username', 'password', 'email'].forEach((attribute: any) => collaborator.setDataValue(attribute, ''));
      sendSuccess(res, collaborator);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new CollaboratorController();
