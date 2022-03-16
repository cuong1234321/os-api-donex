import UserController from '@controllers/api/admin/UsersController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/users/{userId}/active:
 *   patch:
 *     tags:
 *      - "[ADMIN] Users"
 *     summary: Mở khóa TK user
 *     parameters:
 *      - in: path
 *        name: "userId"
 *        description: "userId"
 *        type: "string"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/:userId/active', UserController.active);

/**
 * @openapi
 * /a/users/{userId}/inactive:
 *   patch:
 *     tags:
 *      - "[ADMIN] Users"
 *     summary: Khóa TK user
 *     parameters:
 *      - in: path
 *        name: "userId"
 *        description: "userId"
 *        type: "string"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/:userId/inactive', UserController.inactive);

/**
 * @openapi
 * /a/users/{userId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] Users"
 *     summary: Xóa TK user
 *     parameters:
 *      - in: path
 *        name: "userId"
 *        description: "userId"
 *        type: "string"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.delete('/:userId', UserController.delete);

export default router;
