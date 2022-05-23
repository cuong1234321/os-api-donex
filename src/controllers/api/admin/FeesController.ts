import { sendError, sendSuccess } from '@libs/response';
import Fee from '@repositories/models/fee';
import { Request, Response } from 'express';

class FeeController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(Fee.FEE_CALCULATE_PARAMS).value();
      const fee = await Fee.calculate(params);
      sendSuccess(res, { fee });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async getServices (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(Fee.FEE_SERVICE_PARAMS).value();
      const servicePacks = await Fee.getServicePack(params);
      sendSuccess(res, { servicePacks });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new FeeController();
