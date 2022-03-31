import NewsCategoryController from '@controllers/api/admin/NewsCategoriesController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/news_categories:
 *   get:
 *     tags:
 *      - "[ADMIN] News Categories"
 *     summary: Lấy danh sách danh mục tin tức
 *     parameters:
 *       - in: "query"
 *         name: "freeWord"
 *         description: "freeWord"
 *         type: "string"
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/', NewsCategoryController.index);

/**
 * @openapi
 * /a/news_categories/{newsCategoryId}:
 *   get:
 *     tags:
 *      - "[ADMIN] News Categories"
 *     summary: xem 1 category
 *     parameters:
 *      - in: "path"
 *        name: "newsCategoryId"
 *        description: "Category id"
 *        required: true
 *        type: "number"
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
router.get('/:newsCategoryId', NewsCategoryController.show);

/**
 * @openapi
 * /a/news_categories:
 *   post:
 *     tags:
 *      - "[ADMIN] News Categories"
 *     summary: Tạo mới category
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin category"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
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

router.post('/', NewsCategoryController.create);

/**
 * @openapi
 * /a/news_categories/{newsCategoryId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] News Categories"
 *     summary: Sửa category
 *     parameters:
 *      - in: "path"
 *        name: "newsCategoryId"
 *        description: "Category id"
 *        required: true
 *        type: "number"
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin category"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
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
router.patch('/:newsCategoryId', NewsCategoryController.update);

/**
 * @openapi
 * /a/news_categories/{newsCategoryId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] News Categories"
 *     summary: xóa category
 *     parameters:
 *      - in: "path"
 *        name: "newsCategoryId"
 *        description: "Category id"
 *        required: true
 *        type: "number"
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
router.delete('/:newsCategoryId', NewsCategoryController.delete);

export default router;
