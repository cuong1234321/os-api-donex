import SessionController from '@controllers/api/user/SessionsController';
import { userPassport } from '@middlewares/passport';
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

/**
 * @openapi
 * /u/sessions/current_user:
 *   get:
 *     tags:
 *      - "[USER] Sessions"
 *     summary: lấy user đang đăng nhập
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
router.get('/current_user', userPassport.authenticate('jwt', { session: false }), SessionController.getCurrentUser);

export default router;
