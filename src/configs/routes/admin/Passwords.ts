import { Router } from 'express';
import PasswordController from '@controllers/api/admin/PasswordsController';

const router = Router();

/**
 * @openapi
 * /a/passwords/forgot_password:
 *   post:
 *     tags:
 *      - "[ADMIN] Passwords"
 *     summary: quên mật khẩu
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin"
 *        schema:
 *          type: "object"
 *          properties:
 *            email:
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
  * /a/passwords/verify_otp:
  *   post:
  *     tags:
  *      - "[ADMIN] Passwords"
  *     summary: verify otp
  *     parameters:
  *      - in: "body"
  *        name: "body"
  *        description: ""
  *        schema:
  *          type: "object"
  *          properties:
  *            email:
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
  * /a/passwords:
  *   post:
  *     tags:
  *      - "[ADMIN] Passwords"
  *     summary: tạo mới mật khẩu
  *     parameters:
  *      - in: query
  *        name: "email"
  *        description: "email"
  *        type: "string"
  *      - in: query
  *        name: "token"
  *        description: "token"
  *        type: "string"
  *      - in: "body"
  *        name: "body"
  *        description: "New password"
  *        schema:
  *          type: "object"
  *          properties:
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
