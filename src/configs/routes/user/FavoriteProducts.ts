import FavoriteProductController from '@controllers/api/user/FavoriteProductsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/favorite_products:
 *   post:
 *     tags:
 *      - "[USER] PRODUCT Favorite Product"
 *     summary: Thêm sản phẩm yêu thích
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin admin"
 *        schema:
 *          type: "object"
 *          properties:
 *            productId:
 *              type: "number"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.post('/', FavoriteProductController.create);

export default router;
