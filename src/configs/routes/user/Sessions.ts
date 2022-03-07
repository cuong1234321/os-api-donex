import SessionController from '@controllers/api/user/SessionsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/sessions/login:
 *   post:
 *     tags:
 *      - "[USER] Sessions"
 *     summary: USER Đăng nhập
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        schema:
 *          type: "object"
 *          properties:
 *            phoneNumber:
 *              type: "string"
 *              description: "Số điện thoại"
 *            password:
 *              type: "string"
 *              description: "Mật khẩu"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal errror.
 *     security:
 *      - Bearer: []
 */
router.post('/login', SessionController.create);

export default router;
