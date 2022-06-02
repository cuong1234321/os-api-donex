import NewsCategoryController from '@controllers/api/admin/NewsCategoriesController';
import { Router } from 'express';
import Authorization from '@middlewares/authorization';
const router = Router();

/**
 * @openapi
 * /a/news_categories:
 *   get:
 *     tags:
 *      - "[ADMIN] NEWS CATEGORIES"
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
router.get('/', Authorization.permit(NewsCategoryController.constructor.name, 'index'), NewsCategoryController.index);

/**
 * @openapi
 * /a/news_categories/{newsCategoryId}:
 *   get:
 *     tags:
 *      - "[ADMIN] NEWS CATEGORIES"
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
router.get('/:newsCategoryId', Authorization.permit(NewsCategoryController.constructor.name, 'show'), NewsCategoryController.show);

/**
 * @openapi
 * /a/news_categories:
 *   post:
 *     tags:
 *      - "[ADMIN] NEWS CATEGORIES"
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

router.post('/', Authorization.permit(NewsCategoryController.constructor.name, 'create'), NewsCategoryController.create);

/**
 * @openapi
 * /a/news_categories/{newsCategoryId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] NEWS CATEGORIES"
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
router.patch('/:newsCategoryId', Authorization.permit(NewsCategoryController.constructor.name, 'update'), NewsCategoryController.update);

/**
 * @openapi
 * /a/news_categories/{newsCategoryId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] NEWS CATEGORIES"
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
router.delete('/:newsCategoryId', Authorization.permit(NewsCategoryController.constructor.name, 'delete'), NewsCategoryController.delete);

export default router;
