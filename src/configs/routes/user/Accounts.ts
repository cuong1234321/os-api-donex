import { Router } from 'express';
import AccountController from '@controllers/api/user/AccountsController';

const router = Router();

/**
 * @openapi
 * /u/accounts:
 *   post:
 *     tags:
 *      - "[USER] ACCOUNTS"
 *     summary: Đăng ký user
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin user"
 *        schema:
 *          type: "object"
 *          properties:
 *            phoneNumber:
 *              type: "string"
 *            fullName:
 *              type: "string"
 *            verifyToken:
 *              type: "string"
 *            password:
 *              type: "string"
 *            confirmPassword:
 *              type: "string"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.post('/', AccountController.register);

export default router;
