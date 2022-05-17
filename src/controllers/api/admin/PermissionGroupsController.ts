import { sendError, sendSuccess } from '@libs/response';
import PermissionGroupModel from '@models/permissionGroups';
import { Request, Response } from 'express';

class PermissionController {
  public async index (req:Request, res: Response) {
    try {
      const { freeWord } = req.query;
      const scopes: any = [
        'withPermissions',
      ];
      if (freeWord) { scopes.push({ method: ['byFreeWord', freeWord] }); }
      const permissionGroups = await PermissionGroupModel.scope(scopes).findAll();
      sendSuccess(res, { permissionGroups });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new PermissionController();
