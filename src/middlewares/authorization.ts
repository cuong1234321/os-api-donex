import { NextFunction, Request, Response } from 'express';
import { newModel, newEnforcer } from 'casbin';
import RolePermissionModel from '@models/rolePermissions';
import PermissionModel from '@models/permissions';
import PermissionGroupModel from '@models/permissionGroups';
import { sendError } from '@libs/response';
import { Unauthorized } from '@libs/errors';
import _ from 'lodash';

class Authorization {
  static readonly CONTROLLER_PATTERN = 'Controller';
  static readonly FULL_PERMISSION_ADMIN_ID = 0;

  public permit (controller: string, action: string | string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const rolePermissions = await RolePermissionModel.findAll({
        include: [
          {
            model: PermissionModel,
            as: 'permission',
            include: [
              {
                model: PermissionGroupModel,
                as: 'group',
              },
            ],
          },
        ],
      });
      const enforcer = await Authorization.initEnforcer();
      for (const rolePermission of rolePermissions) {
        await enforcer.addPermissionForUser(rolePermission.roleId.toString(), rolePermission.permission.group.key, rolePermission.permission.key);
      }
      if (!req.currentAdmin) return sendError(res, 403, Unauthorized);
      if (req.currentAdmin.roleId === Authorization.FULL_PERMISSION_ADMIN_ID) return next();
      let isAuthorized: boolean = false;
      if (Array.isArray(action)) {
        for (const singleAction of action) {
          if (await enforcer.enforce(req.currentAdmin.roleId.toString(), _.snakeCase(controller.replace(Authorization.CONTROLLER_PATTERN, '')), singleAction)) {
            isAuthorized = true;
          }
        }
      } else {
        if (await enforcer.enforce(req.currentAdmin.roleId.toString(), _.snakeCase(controller.replace(Authorization.CONTROLLER_PATTERN, '')), action)) {
          isAuthorized = true;
        }
      }
      if (isAuthorized) {
        next();
      } else {
        sendError(res, 403, Unauthorized);
      }
    };
  }

  private static async initEnforcer () {
    const model = await newModel();
    model.addDef('r', 'r', 'sub, obj, act');
    model.addDef('p', 'p', 'sub, obj, act');
    model.addDef('g', 'g', '_, _');
    model.addDef('e', 'e', 'some(where (p.eft == allow))');
    model.addDef('m', 'm', 'g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act');
    const enforcer = await newEnforcer(model);
    return enforcer;
  }
}

export default new Authorization();
