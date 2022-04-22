import { Router } from 'express';
import AccountController from '@controllers/api/admin/AccountsController';

const router = Router();

/**
 * @openapi
 * /a/accounts:
 *   patch:
 *     tags:
 *      - "[ADMIN] Accounts"
 *     summary: update admin
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin admin"
 *        schema:
 *          type: "object"
 *          properties:
 *            fullName:
 *              type: "string"
 *            gender:
 *              description: "gioi tinh"
 *              type: "string"
 *              enum:
 *               - male
 *               - female
 *               - other
 *            dateOfBirth:
 *              description: "YYYY/MM/DD"
 *            email:
 *              type: "string"
 *            phoneNumber:
 *              type: "string"
 *            username:
 *              type: "string"
 *            avatar:
 *              type: "string"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/', AccountController.update);

/**
  * @openapi
  * /a/accounts/change_password:
  *   patch:
  *     tags:
  *      - "[ADMIN] Accounts"
  *     summary: thay đổi mật khẩu
  *     parameters:
  *      - in: "body"
  *        name: "body"
  *        description: ""
  *        schema:
  *          type: "object"
  *          properties:
  *            oldPassword:
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
router.patch('/change_password', AccountController.changePassword);

export default router;
