import { Router } from 'express';
import NewsController from '@controllers/api/admin/NewsController';
import { withoutSavingUploader } from '@middlewares/uploaders';

const router = Router();

/**
 * @openapi
 * /a/news:
 *   get:
 *     tags:
 *      - "[ADMIN] NEWS"
 *     summary: Lấy danh sách tin tức
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "string"
 *      - in: query
 *        name: "status"
 *        description: "status"
 *        type: "string"
 *      - in: query
 *        name: "categoryId"
 *        description: "Danh mục"
 *        type: "string"
 *      - in: query
 *        name: "freeWord"
 *        description: "Tìm kiếm theo tên"
 *        type: "string"
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/', NewsController.index);

/**
 * @openapi
 * /a/news:
 *   post:
 *     tags:
 *      - "[ADMIN] NEWS"
 *     summary: Tạo mới tin tức
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin product"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *              description: "Tiêu đề tin tức"
 *            newsCategoryId:
 *              type: "number"
 *              description: "Id danh mục tin tức"
 *            content:
 *              type: "string"
 *              description: "Nội dung tin tức"
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
router.post('/', NewsController.create);

/**
 * @openapi
 * /a/news/{newsId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] NEWS"
 *     summary: Sửa tin tức
 *     parameters:
 *      - in: path
 *        name: "newsId"
 *        description: "newsId"
 *        type: number
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin product"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *              description: "Tiêu đề tin tức"
 *            newsCategoryId:
 *              type: "string"
 *              description: "Id danh mục tin tức"
 *            content:
 *              type: "string"
 *              description: "Nội dung tin tức"
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
router.patch('/:newsId', NewsController.update);

/**
 * @openapi
 * /a/news/{newsId}/upload_thumbnail:
 *   patch:
 *     tags:
 *      - "[ADMIN] NEWS"
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
 *        name: "newsId"
 *        required: true
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.patch('/:newsId/upload_thumbnail', withoutSavingUploader.single('thumbnail'), NewsController.uploadThumbnail);

/**
 * @openapi
 * /a/news/{newsId}:
 *   get:
 *     tags:
 *      - "[ADMIN] NEWS"
 *     summary: Chi tiết tin tức
 *     parameters:
 *      - in: path
 *        name: "newsId"
 *        description: "newsId"
 *        type: number
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
router.get('/:newsId', NewsController.show);

/**
 * @openapi
 * /a/news/{newsId}/active:
 *   patch:
 *     tags:
 *      - "[ADMIN] NEWS"
 *     summary: active tin tức
 *     parameters:
 *      - in: path
 *        name: "newsId"
 *        description: "newsId"
 *        type: number
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
router.patch('/:newsId/active', NewsController.active);

/**
 * @openapi
 * /a/news/{newsId}/inactive:
 *   patch:
 *     tags:
 *      - "[ADMIN] NEWS"
 *     summary: active tin tức
 *     parameters:
 *      - in: path
 *        name: "newsId"
 *        description: "newsId"
 *        type: number
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
router.patch('/:newsId/inactive', NewsController.inactive);

/**
 * @openapi
 * /a/news/{newsId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] NEWS"
 *     summary: Xóa tin tức
 *     parameters:
 *      - in: path
 *        name: "newsId"
 *        description: "newsId"
 *        type: number
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
router.delete('/:newsId', NewsController.delete);

export default router;
