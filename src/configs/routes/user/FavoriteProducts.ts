import FavoriteProductController from '@controllers/api/user/FavoriteProductsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/favorite_products:
 *   get:
 *     tags:
 *      - "[USER] PRODUCT Favorite Product"
 *     summary: Danh sách yêu thích
 *     parameters:
 *       - in: "query"
 *         name: "page"
 *         description: "xem trang bao nhiêu"
 *         type: "number"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.get('/', FavoriteProductController.index);

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

/**
 * @openapi
 * /u/favorite_products/{productId}:
 *   delete:
 *     tags:
 *      - "[USER] PRODUCT Favorite Product"
 *     summary: Bỏ yêu thích
 *     parameters:
 *      - in: "path"
 *        name: "productId"
 *        type: "integer"
 *        description: "Mã sản phẩm"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.delete('/:productId', FavoriteProductController.delete);

export default router;
