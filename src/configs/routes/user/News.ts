import { Router } from 'express';
import NewsController from '@controllers/api/user/NewsController';

const router = Router();

/**
 * @openapi
 * /u/news:
 *   get:
 *     tags:
 *      - "[USER] NEWS"
 *     summary: Lấy danh sách tin tức
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
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
 * /u/news/{newsId}:
 *   get:
 *     tags:
 *      - "[USER] NEWS"
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

export default router;
