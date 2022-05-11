import { Router } from 'express';
import PasswordController from '@controllers/api/seller/PasswordsController';

const router = Router();

/**
 * @openapi
 * /s/passwords/forgot_password:
 *   post:
 *     tags:
 *      - "[SELLER] PASSWORDS"
 *     summary: quên mật khẩu
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin sdt"
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
  * /s/passwords/verify_otp:
  *   post:
  *     tags:
  *      - "[SELLER] PASSWORDS"
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
  * /s/passwords:
  *   post:
  *     tags:
  *      - "[SELLER] PASSWORDS"
  *     summary: tạo mới mật khẩu sau khi quên mật khẩu
  *     parameters:
  *      - in: "body"
  *        name: "body"
  *        description: "New password"
  *        schema:
  *          type: "object"
  *          properties:
  *            email:
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
