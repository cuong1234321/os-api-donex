import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import SystemSettingModel from '@models/systemSetting';

class SystemSettingController {
  public async show (req: Request, res: Response) {
    try {
      let systemSetting: any = (await SystemSettingModel.findOrCreate({
        where: { },
        defaults: { id: undefined },
      }))[0];
      systemSetting = systemSetting.toJSON();
      delete systemSetting.environment;
      delete systemSetting.accessToken;
      delete systemSetting.companyCode;
      sendSuccess(res, { systemSetting });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      let systemSetting: any = (await SystemSettingModel.findOrCreate({
        where: { },
        defaults: { id: undefined },
      }))[0];
      await systemSetting.update(req.body);
      systemSetting = systemSetting.toJSON();
      delete systemSetting.environment;
      delete systemSetting.accessToken;
      delete systemSetting.companyCode;
      sendSuccess(res, { systemSetting });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SystemSettingController();
