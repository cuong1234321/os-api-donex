import { sendError, sendSuccess } from '@libs/response';
import Auth from '@repositories/models/auth';
import Fee from '@repositories/models/fee';
import { Request, Response } from 'express';

class FeeController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(Fee.FEE_CALCULATE_PARAMS).value();
      const auth = await Auth.login();
      const fee = await Fee.calculate(auth, params);
      sendSuccess(res, { fee });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new FeeController();
