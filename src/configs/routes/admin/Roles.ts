import RolesController from '@controllers/api/admin/RolesController';
import { Router } from 'express';
import Authorization from '@middlewares/authorization';

const router = Router();

/**
 * @openapi
 * /a/roles/:
 *   get:
 *     tags:
 *      - "[ADMIN] ROLES"
 *     summary: Xem danh sach
 *     parameters:
 *      - in: "query"
 *        name: "freeWord"
 *        type: "string"
 *        description: "freeWord"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/', Authorization.permit(RolesController.constructor.name, 'index'), RolesController.index);

/**
 * @openapi
 * /a/roles/{roleId}:
 *   get:
 *     tags:
 *      - "[ADMIN] ROLES"
 *     summary: Xem chi tiết
 *     parameters:
 *      - in: "path"
 *        name: "roleId"
 *        type: "string"
 *        description: "roleId"
 *      - in: "query"
 *        name: "freeWord"
 *        type: "string"
 *        description: "ten nv"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/:roleId', Authorization.permit(RolesController.constructor.name, 'show'), RolesController.show);

/**
 * @openapi
 * /a/roles/{roleId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] ROLES"
 *     summary: xoa
 *     parameters:
 *      - in: "path"
 *        name: "roleId"
 *        type: "string"
 *        description: "roleId"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.delete('/:roleId', Authorization.permit(RolesController.constructor.name, 'delete'), RolesController.delete);

/**
 * @openapi
 * /a/roles/{roleId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] ROLES"
 *     summary: chinh sua
 *     parameters:
 *      - in: "path"
 *        name: "roleId"
 *        type: "string"
 *        description: "roleId"
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin product"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *              description: "Tên role"
 *              default: "Tên role"
 *            description:
 *              type: "string"
 *              description: "mô tả"
 *            rolePermissions:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  permissionId:
 *                    type: "number"
 *                    description: "id permission"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.patch('/:roleId', Authorization.permit(RolesController.constructor.name, 'update'), RolesController.update);

/**
 * @openapi
 * /a/roles/:
 *   post:
 *     tags:
 *      - "[ADMIN] ROLES"
 *     summary: Tao moi
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin product"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *              description: "Tên role"
 *              default: "Tên role"
 *            description:
 *              type: "string"
 *              description: "mô tả"
 *            rolePermissions:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  permissionId:
 *                    type: "number"
 *                    description: "id permission"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.post('/', Authorization.permit(RolesController.constructor.name, 'create'), RolesController.create);

export default router;
