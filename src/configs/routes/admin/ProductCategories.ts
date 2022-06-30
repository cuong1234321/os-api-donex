import ProductCategoryController from '@controllers/api/admin/ProductCategoriesController';
import { withoutSavingUploader } from '@middlewares/uploaders';
import Authorization from '@middlewares/authorization';
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
 *            index:
 *              type: "number"
 *              description: "thu tu uu tien"
 *            type:
 *              type: "type"
 *              description: ""
 *              enum:
 *                - none
 *                - collection
 *                - gender
 *                - productType
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
router.post('/', Authorization.permit(ProductCategoryController.constructor.name, 'create,uploadThumbnail'), ProductCategoryController.create);

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
router.get('/', Authorization.permit(ProductCategoryController.constructor.name, 'index'),
  ProductCategoryController.index);

/**
 * @openapi
 * /a/product_categories/{productCategoryId}:
 *   get:
 *     tags:
 *      - "[ADMIN] PRODUCT CATEGORY"
 *     summary: chi tiet category
 *     parameters:
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
router.get('/:productCategoryId', Authorization.permit(ProductCategoryController.constructor.name, 'show'), ProductCategoryController.show);

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
router.patch('/:productCategoryId/upload_thumbnail', Authorization.permit(ProductCategoryController.constructor.name, ['update,uploadThumbnail', 'create,uploadThumbnail']),
  withoutSavingUploader.single('thumbnail'), ProductCategoryController.uploadThumbnail);

/**
* @openapi
* /a/product_categories/{productCategoryId}:
*   patch:
*     tags:
*      - "[ADMIN] PRODUCT CATEGORY"
*     summary: chỉnh sửa danh mục
*     parameters:
*      - in: "path"
*        name: "productCategoryId"
*        required: true
*      - in: "body"
*        name: "body"
*        description: "Thông tin product category"
*        schema:
*          type: "object"
*          properties:
*            name:
*              type: "string"
*              description: "Tên danh mục"
*              default: "Name example"
*            parentId:
*              type: "integer"
*              description: "id danh mục cha"
*              default: null
*            index:
*              type: "number"
*              description: "thu tu uu tien"
*     responses:
*       200:
*         description: "Upload success"
*       500:
*         description: "Upload failed"
*     security:
*      - Bearer: []
*/
router.patch('/:productCategoryId', Authorization.permit(ProductCategoryController.constructor.name, 'update,uploadThumbnail'), ProductCategoryController.update);

/**
* @openapi
* /a/product_categories/{productCategoryId}:
*   delete:
*     tags:
*      - "[ADMIN] PRODUCT CATEGORY"
*     summary: Xóa category
*     parameters:
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
router.delete('/:productCategoryId', Authorization.permit(ProductCategoryController.constructor.name, 'delete'), ProductCategoryController.delete);

export default router;
