import SessionController from '@controllers/api/admin/SessionsController';
import { adminPassport } from '@middlewares/passport';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/sessions/login:
 *   post:
 *     tags:
 *      - "[ADMIN] Sessions"
 *     summary: ADMIN Đăng nhập
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

/**
 * @openapi
 * /a/sessions/current_admin:
 *   get:
 *     tags:
 *      - "[ADMIN] Sessions"
 *     summary: lấy admin đang đăng nhập
 *     responses:
 *       200:
 *         description: Return data.
 *       404:
 *         description: not found
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/current_admin', adminPassport.authenticate('jwt', { session: false }), SessionController.getCurrentAdmin);

export default router;
