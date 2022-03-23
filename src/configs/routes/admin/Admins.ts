import { Router } from 'express';
import AdminController from '@controllers/api/admin/AdminsController';
import { withoutSavingUploader } from '@middlewares/uploaders';

const router = Router();

/**
 * @openapi
 * /a/admins:
 *   post:
 *     tags:
 *      - "[ADMIN] ADMINS"
 *     summary: Thêm mới admin
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin admin"
 *        schema:
 *          type: "object"
 *          properties:
 *            phoneNumber:
 *              type: "string"
 *            fullName:
 *              type: "string"
 *            username:
 *              type: "string"
 *            email:
 *              type: "string"
 *            gender:
 *              type: "string"
 *              enum:
 *               - male
 *               - female
 *               - other
 *            dateOfBirth:
 *              type: "string"
 *              default: "2000/01/01"
 *            note:
 *              type: "string"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.post('/', AdminController.create);

/**
 * @openapi
 * /a/admins/{adminId}/avatar:
 *   patch:
 *     tags:
 *      - "[ADMIN] ADMINS"
 *     summary: Upload avatar cho admin
 *     consumes:
 *      - "multipart/form-data"
 *     produces:
 *      - "application/json"
 *     parameters:
 *      - in: "path"
 *        name: "adminId"
 *        required: true
 *        type: "number"
 *      - in: "formData"
 *        name: "avatar"
 *        description: "File upload"
 *        required: false
 *        type: "file"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/:adminId/avatar',
  withoutSavingUploader.single('avatar'),
  AdminController.uploadAvatar);

export default router;
