import { Router } from 'express';
import PopupController from '@controllers/api/admin/PopupsController';
import { withoutSavingUploader } from '@middlewares/uploaders';
import Authorization from '@middlewares/authorization';

const router = Router();

/**
 * @openapi
 * /a/popups:
 *   get:
 *     tags:
 *      - "[ADMIN] POPUPS"
 *     summary: danh sach popup
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "number"
 *      - in: query
 *        name: "size"
 *        description: "limit"
 *        type: "number"
 *      - in: "query"
 *        name: "applyAtOrder"
 *        enum:
 *         - DESC
 *         - ASC
 *      - in: "query"
 *        name: "applyToOrder"
 *        enum:
 *         - DESC
 *         - ASC
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/', Authorization.permit(PopupController.constructor.name, 'index'), PopupController.index);

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
router.get('/:popupId', Authorization.permit(PopupController.constructor.name, 'show'), PopupController.show);

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
router.post('/', Authorization.permit(PopupController.constructor.name, 'create,uploadImage'), PopupController.create);

/**
 * @openapi
 * /a/popups/{popupId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] POPUPS"
 *     summary: Cap nhat popup
 *     parameters:
 *      - in: "path"
 *        name: "popupId"
 *        required: true
 *        type: "number"
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
 *            status:
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
router.patch('/:popupId', Authorization.permit(PopupController.constructor.name, 'update,uploadImage'), PopupController.update);

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
router.patch('/:popupId/image', Authorization.permit(PopupController.constructor.name, 'update,uploadImage'),
  withoutSavingUploader.single('image'),
  PopupController.uploadImage);

/**
 * @openapi
 * /a/popups/{popupId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] POPUPS"
 *     summary: Xoa popup
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
router.delete('/:popupId', Authorization.permit(PopupController.constructor.name, 'delete'), PopupController.delete);

export default router;
