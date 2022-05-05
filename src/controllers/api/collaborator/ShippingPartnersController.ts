import { sendError, sendSuccess } from '@libs/response';
import Auth from '@repositories/models/auth';
import ShippingPartner from '@repositories/models/shippingPartners';
import { Request, Response } from 'express';

class ShippingPartnerController {
  public async index (req: Request, res: Response) {
    try {
      const auth = await Auth.login();
      const shippingPartners = await ShippingPartner.index(auth);
      const result = ShippingPartner.shippingPartnerDTO(shippingPartners);
      sendSuccess(res, result);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new ShippingPartnerController();
