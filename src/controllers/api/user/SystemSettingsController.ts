import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import SystemSettingModel from '@models/systemSetting';

class SystemSettingController {
  public async show (req: Request, res: Response) {
    try {
      const systemSetting = (await SystemSettingModel.findOrCreate({
        where: { },
        defaults: { id: undefined },
      }))[0];
      sendSuccess(res, { systemSetting });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SystemSettingController();
