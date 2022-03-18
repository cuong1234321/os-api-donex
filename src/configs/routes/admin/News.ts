import { Router } from 'express';
import NewsController from '@controllers/api/admin/NewsController';

const router = Router();

/**
 * @openapi
 * /a/news:
 *   post:
 *     tags:
 *      - "[ADMIN] News"
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
router.post('/', NewsController.create);

export default router;
