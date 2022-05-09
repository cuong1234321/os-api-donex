import SessionController from '@controllers/api/seller/SessionsController';
import { sellerPassport } from '@middlewares/passport';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /s/sessions/login:
 *   post:
 *     tags:
 *      - "[SELLER] SESSIONS"
 *     summary: CTV/DL/NPP Đăng nhập
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
 * /s/sessions/current:
 *   get:
 *     tags:
 *      - "[SELLER] SESSIONS"
 *     summary: lấy CTV/DL/NPP đang đăng nhập
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
router.get('/current', sellerPassport.authenticate('jwt', { session: false }), SessionController.current);

export default router;
