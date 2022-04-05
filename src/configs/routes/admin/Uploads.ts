import UploadController from '@controllers/api/admin/UploadsController';
import { withoutSavingUploader } from '@middlewares/uploaders';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/uploads:
 *   post:
 *     tags:
 *      - "[ADMIN] UPLOAD"
 *     summary: Upload file
 *     consumes:
 *      - "multipart/form-data"
 *     produces:
 *      - "application/json"
 *     parameters:
 *      - in: "formData"
 *        name: "File upload"
 *        description: "File upload"
 *        required: false
 *        allowMultiple: false
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
router.post('/', withoutSavingUploader.any(), UploadController.uploads);

export default router;
