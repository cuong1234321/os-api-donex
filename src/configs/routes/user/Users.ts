import { Router } from 'express';
import UserController from '@controllers/api/user/UsersController';
import { withoutSavingUploader } from '@middlewares/uploaders';

const router = Router();

/**
 * @openapi
 * /u/users:
 *   patch:
 *     tags:
 *      - "[USER] Users"
 *     summary: update user
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
 *            dateOfBirth:
 *              type: "date"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/', UserController.update);

/**
  * @openapi
  * /u/users/upload_avatar:
  *   patch:
  *     tags:
  *      - "[USER] Users"
  *     summary: Tải lên avatar
  *     consumes:
  *      - "multipart/form-data"
  *     produces:
  *      - "application/json"
  *     parameters:
  *      - in: "formData"
  *        name: "avatar"
  *        description: "File upload"
  *        required: false
  *        allowMultiple: true
  *        type: "file"
  *     responses:
  *       200:
  *         description: "Upload success"
  *       500:
  *         description: "Upload failed"
  *     security:
  *      - Bearer: []
  */
router.patch('/upload_avatar',
  withoutSavingUploader.single('avatar'), UserController.uploadAvatar);

export default router;
