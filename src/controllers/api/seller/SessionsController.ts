import { BadAuthentication, AccountNotActive, NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import CollaboratorModel from '@models/collaborators';
import { Request, Response } from 'express';
import settings from '@configs/settings';

class SessionController {
  public async create (req: Request, res: Response) {
    try {
      const { phoneNumber, password } = req.body;
      const collaborator = await CollaboratorModel.scope([{ method: ['byPhoneNumber', phoneNumber] }]).findOne();
      if (!collaborator || !(await collaborator.validPassword(password))) {
        return sendError(res, 404, BadAuthentication);
      }
      if (collaborator.status !== CollaboratorModel.STATUS_ENUM.ACTIVE) return sendError(res, 403, AccountNotActive);
      const accessToken = await collaborator.generateAccessToken();
      sendSuccess(res, { accessToken, tokenExpireAt: settings.jwt.ttl });
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  public async getCurrentCollaborator (req: Request, res: Response) {
    try {
      let collaborator = req.currentCollaborator;
      collaborator = await CollaboratorModel.scope([
        { method: ['byId', collaborator.id] },
        'withAddressInfo',
        'withMedia',
        'withWorkingDay',
        'withParent',
      ]).findOne();
      if (!collaborator) sendError(res, 404, NoData);
      sendSuccess(res, collaborator);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SessionController();
