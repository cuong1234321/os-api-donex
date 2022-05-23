import { sendError, sendSuccess } from '@libs/response';
import PickShift from '@repositories/models/pickShifts';
import { Request, Response } from 'express';

class PickShiftController {
  public async index (req: Request, res: Response) {
    try {
      const pickShift = await PickShift.pickShifts();
      sendSuccess(res, pickShift);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new PickShiftController();
