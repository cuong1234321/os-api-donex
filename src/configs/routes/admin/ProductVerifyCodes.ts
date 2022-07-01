import ProductVerifyCodeController from '@controllers/api/admin/ProductVerifyCodesController';
import { withoutSavingUploader } from '@middlewares/uploaders';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/product_verify_codes/:
 *   get:
 *     tags:
 *      - "[ADMIN] PRODUCT VERIFY CODE"
 *     summary: Danh sach ma xac minh
 *     description: Danh sach ma xac minh
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "number"
 *      - in: query
 *        name: "size"
 *        description: "size"
 *        type: "number"
 *      - in: query
 *        name: "freeWord"
 *        description: "tim theo ma sku, ma xac minh"
 *        type: "string"
 *      - in: query
 *        name: "status"
 *        description: "trang thai"
 *        type: "string"
 *        enum:
 *          - used
 *          - notUse
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
router.get('/', ProductVerifyCodeController.index);

/**
 * @openapi
 * /a/product_verify_codes/download_template:
 *   get:
 *     tags:
 *      - "[ADMIN] PRODUCT VERIFY CODE"
 *     summary: Tải xuống template
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/download_template', ProductVerifyCodeController.downloadTemplate);

/**
 * @openapi
 * /a/product_verify_codes/upload:
 *   post:
 *     tags:
 *      - "[ADMIN] PRODUCT VERIFY CODE"
 *     summary: upload product verify
 *     consumes:
 *      - "multipart/form-data"
 *     produces:
 *      - "application/json"
 *     parameters:
 *      - in: "formData"
 *        name: "file"
 *        description: "File upload"
 *        required: true
 *        allowMultiple: false
 *        type: "file"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.post('/upload', withoutSavingUploader.single('file'), ProductVerifyCodeController.upload);

export default router;
