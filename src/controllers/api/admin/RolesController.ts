import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import RoleModel from '@models/roles';
import { Transaction } from 'sequelize/types';
import sequelize from '@initializers/sequelize';
import RolePermissionModel from '@models/rolePermissions';
import { NoData } from '@libs/errors';

class RoleController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(RoleModel.CREATABLE_PARAMETERS).value();
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const record = await RoleModel.create(params, {
          include: [
            { model: RolePermissionModel, as: 'rolePermissions' },
          ],
          transaction,
        });
        return record;
      });
      sendSuccess(res, { role: result });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const role = await RoleModel.findByPk(req.params.roleId);
      if (!role) {
        return sendError(res, 404, NoData);
      }
      const params = req.parameters.permit(RoleModel.UPDATABLE_PARAMETERS).value();
      await sequelize.transaction(async (transaction: Transaction) => {
        await role.update(params, { transaction });
        await role.updateRolePermissions(params.rolePermissions, transaction);
      });
      sendSuccess(res, { role });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const role = await RoleModel.findByPk(req.params.roleId);
      if (!role) {
        return sendError(res, 404, NoData);
      }
      await role.destroy();
      sendSuccess(res, { role });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const role = await RoleModel.scope([
        { method: ['withRolePermission'] },
      ]).findByPk(req.params.roleId);
      if (!role) {
        return sendError(res, 404, NoData);
      }
      sendSuccess(res, { role });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const scopes: any = [
        { method: ['bySorting', 'createdAt', 'DESC'] },
        'withRolePermission',
        'withTotalUser',
      ];
      const { freeWord } = req.query;
      if (freeWord) { scopes.push({ method: ['byFreeWord', freeWord] }); }
      const roles = await RoleModel.scope(scopes).findAll();
      sendSuccess(res, { roles });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new RoleController();
