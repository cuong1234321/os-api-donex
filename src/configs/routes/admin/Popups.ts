import { Router } from 'express';
import PopupController from '@controllers/api/admin/PopupsController';
import { withoutSavingUploader } from '@middlewares/uploaders';

const router = Router();

/**
 * @openapi
 * /a/popups/{popupId}:
 *   get:
 *     tags:
 *      - "[ADMIN] POPUPS"
 *     summary: xem chi tiet mot popup
 *     parameters:
 *      - in: "path"
 *        name: "popupId"
 *        required: true
 *        type: "number"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/:popupId', PopupController.show);

/**
 * @openapi
 * /a/popups:
 *   post:
 *     tags:
 *      - "[ADMIN] POPUPS"
 *     summary: Thêm mới popup
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin admin"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *            link:
 *              type: "string"
 *            frequency:
 *              type: "number"
 *            applyAt:
 *              type: "Date"
 *            applyTo:
 *              type: "Date"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.post('/', PopupController.create);

/**
 * @openapi
 * /a/popups/{popupId}/image:
 *   patch:
 *     tags:
 *      - "[ADMIN] POPUPS"
 *     summary: Upload image cho popup
 *     consumes:
 *      - "multipart/form-data"
 *     produces:
 *      - "application/json"
 *     parameters:
 *      - in: "path"
 *        name: "popupId"
 *        required: true
 *        type: "number"
 *      - in: "formData"
 *        name: "image"
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
router.patch('/:popupId/image',
  withoutSavingUploader.single('image'),
  PopupController.uploadImage);

export default router;
