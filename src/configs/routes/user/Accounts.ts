import { Router } from 'express';
import AccountController from '@controllers/api/user/accountsController';

const router = Router();

/**
 * @openapi
 * /u/accounts:
 *   post:
 *     tags:
 *      - "[USER] Accounts"
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
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.post('/', AccountController.register);

/**
  * @openapi
  * /u/accounts/{userId}/verify_otp:
  *   post:
  *     tags:
  *      - "[USER] Accounts"
  *     summary: Kiểm tra OTP
  *     parameters:
  *      - in: path
  *        name: "userId"
  *        type: number
  *      - in: "body"
  *        name: "body"
  *        schema:
  *          type: "object"
  *          properties:
  *            otp:
  *              type: "string"
  *     responses:
  *       200:
  *         description: Return data.
  *       500:
  *         description: Lỗi không xác định
  *     security:
  *      - Bearer: []
  */
router.post('/:userId/verify_otp', AccountController.verify);

/**
  * @openapi
  * /u/accounts/{userId}/create_password:
  *   post:
  *     tags:
  *      - "[USER] Accounts"
  *     summary: tạo mới mật khẩu
  *     parameters:
  *      - in: path
  *        name: "userId"
  *        type: number
  *      - in: "body"
  *        name: "body"
  *        description: "New password"
  *        schema:
  *          type: "object"
  *          properties:
  *            otp:
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
router.post('/:userId/create_password', AccountController.createPassword);

export default router;
