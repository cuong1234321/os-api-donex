import { Router } from 'express';
import PasswordController from '@controllers/api/user/PasswordsController';

const router = Router();

/**
 * @openapi
 * /u/passwords/forgot_password:
 *   post:
 *     tags:
 *      - "[USER] Passwords"
 *     summary: quên mật khẩu
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin sdt"
 *        schema:
 *          type: "object"
 *          properties:
 *            phoneNumber:
 *              type: "string"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.post('/forgot_password', PasswordController.forgotPassword);

/**
  * @openapi
  * /u/passwords/verify_otp:
  *   post:
  *     tags:
  *      - "[USER] Passwords"
  *     summary: verify otp
  *     parameters:
  *      - in: "body"
  *        name: "body"
  *        description: ""
  *        schema:
  *          type: "object"
  *          properties:
  *            phoneNumber:
  *              type: "string"
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
router.post('/verify_otp', PasswordController.verifyOtp);

/**
  * @openapi
  * /u/passwords:
  *   post:
  *     tags:
  *      - "[USER] Passwords"
  *     summary: tạo mới mật khẩu sau khi quên mật khẩu
  *     parameters:
  *      - in: "body"
  *        name: "body"
  *        description: "New password"
  *        schema:
  *          type: "object"
  *          properties:
  *            phoneNumber:
  *              type: "string"
  *            token:
  *              type: "string"
  *            newPassword:
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
router.post('/', PasswordController.resetPassword);

export default router;
