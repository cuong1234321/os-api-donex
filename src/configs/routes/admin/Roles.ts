import RolesController from '@controllers/api/admin/RolesController';
import { Router } from 'express';

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
router.get('/', RolesController.index);

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
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/:roleId', RolesController.show);

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
router.delete('/:roleId', RolesController.delete);

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
router.patch('/:roleId', RolesController.update);

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
router.post('/', RolesController.create);

export default router;
