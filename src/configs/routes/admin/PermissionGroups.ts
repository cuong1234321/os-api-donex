import PermissionGroupsController from '@controllers/api/admin/PermissionGroupsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/permission_groups/:
 *   get:
 *     tags:
 *      - "[ADMIN] PERMISSION GROUPS"
 *     summary: Xem chi tiết
 *     parameters:
 *      - in: "query"
 *        name: "freeWord"
 *        type: "string"
 *        description: "tên group"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/', PermissionGroupsController.index);

export default router;
