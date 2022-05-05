import { Router } from 'express';
import AuthenticationOtpController from '@controllers/api/user/AuthenticationOtpsController';

const router = Router();

/**
 * @openapi
 * /u/authentication_otps/send:
 *   post:
 *     tags:
 *      - "[USER] AUTHENTICATION OTPS"
 *     summary: Gui otp
 *     parameters:
 *      - in: "body"
 *        name: "body"
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
router.post('/send', AuthenticationOtpController.sendOtp);

/**
  * @openapi
  * /u/authentication_otps/verify:
  *   post:
  *     tags:
  *      - "[USER] AUTHENTICATION OTPS"
  *     summary: Kiểm tra OTP
  *     parameters:
  *      - in: "body"
  *        name: "body"
  *        schema:
  *          type: "object"
  *          properties:
  *            otp:
  *              type: "string"
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
router.post('/verify', AuthenticationOtpController.verify);

export default router;
