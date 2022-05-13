import { BadAuthentication, AccountNotActive, NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import CollaboratorModel from '@models/collaborators';
import { Request, Response } from 'express';
import settings from '@configs/settings';

class SessionController {
  public async create (req: Request, res: Response) {
    try {
      const { phoneNumber, password } = req.body;
      const seller = await CollaboratorModel.scope([{ method: ['byPhoneNumber', phoneNumber] }]).findOne();
      if (!seller || !(await seller.validPassword(password))) {
        return sendError(res, 404, BadAuthentication);
      }
      if (seller.status !== CollaboratorModel.STATUS_ENUM.ACTIVE) return sendError(res, 403, AccountNotActive);
      const accessToken = await seller.generateAccessToken();
      sendSuccess(res, { accessToken, tokenExpireAt: settings.jwt.ttl });
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  public async current (req: Request, res: Response) {
    try {
      const seller = req.currentSeller;
      seller.setDataValue('province', await seller.getProvince());
      seller.setDataValue('district', await seller.getDistrict());
      seller.setDataValue('ward', await seller.getWard());
      seller.setDataValue('media', await seller.getMedia());
      seller.setDataValue('workingDays', await seller.getWorkingDays());
      const parent = await seller.getParent();
      seller.setDataValue('parent', { fullName: parent?.fullName || '', id: parent?.id || null });
      if (!seller) sendError(res, 404, NoData);
      sendSuccess(res, seller);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SessionController();
