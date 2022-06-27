import ProductVerifyCodeController from '@controllers/api/admin/ProductVerifyCodesController';
import { withoutSavingUploader } from '@middlewares/uploaders';
import { Router } from 'express';

const router = Router();

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
