import ProductCategoryController from '@controllers/api/admin/ProductCategoryController';
import { withoutSavingUploader } from '@middlewares/uploaders';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/product_categories:
 *   post:
 *     tags:
 *      - "[ADMIN] PRODUCT CATEGORY"
 *     summary: Tạo mới product category
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin product category"
 *        schema:
 *          type: "object"
 *          properties:
 *            parentId:
 *              type: "integer"
 *              description: "Id của danh mục cha"
 *              default: null
 *            name:
 *              type: "string"
 *              description: "Tên danh mục"
 *              default: "Name example"
 *     responses:
 *       200:
 *         description: Return data.
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Error can't get data.
 *     security:
 *      - Bearer: []
 */
router.post('/', ProductCategoryController.create);

/**
 * @openapi
 * /a/product_categories:
 *   get:
 *     tags:
 *      - "[ADMIN] PRODUCT CATEGORY"
 *     summary: dánh sách danh mục
 *     parameters:
 *      - in: "query"
 *        name: type
 *        description: "Loai danh muc"
 *        enum:
 *         - none
 *         - gender
 *         - collection
 *         - productType
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/',
  ProductCategoryController.index);

/**
 * @openapi
 * /a/product_categories/{productCategoryId}/upload_thumbnail:
 *   patch:
 *     tags:
 *      - "[ADMIN] PRODUCT CATEGORY"
 *     summary: Tải lên thumbnail
 *     consumes:
 *      - "multipart/form-data"
 *     produces:
 *      - "application/json"
 *     parameters:
 *      - in: "formData"
 *        name: "thumbnail"
 *        description: "File upload"
 *        required: false
 *        allowMultiple: true
 *        type: "file"
 *      - in: "path"
 *        name: "productCategoryId"
 *        required: true
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.patch('/:productCategoryId/upload_thumbnail',
  withoutSavingUploader.single('thumbnail'), ProductCategoryController.uploadThumbnail);

export default router;
