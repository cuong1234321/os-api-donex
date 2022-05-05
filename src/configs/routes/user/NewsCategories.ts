import NewsCategoryController from '@controllers/api/admin/NewsCategoriesController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/news_categories:
 *   get:
 *     tags:
 *      - "[USER] NEWS CATEGORIES"
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

export default router;
