import CartController from '@controllers/api/user/CartsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/carts:
 *   get:
 *     tags:
 *      - "[USER] CARTS"
 *     summary: Chi tiết giỏ hàng
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.get('/', CartController.show);

/**
 * @openapi
 * /u/carts:
 *   post:
 *     tags:
 *      - "[USER] CARTS"
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        schema:
 *          type: "object"
 *          properties:
 *            productVariantId:
 *              type: "integer"
 *              description: "Id của sku"
 *            quantity:
 *              type: "integer"
 *              description: "Số lượng thay đổi"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.post('/', CartController.create);

/**
 * @openapi
 * /u/carts:
 *   put:
 *     tags:
 *      - "[USER] CARTS"
 *     summary: Sửa sổ lượng sản phẩm trong giỏ hàng
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        schema:
 *          type: "object"
 *          properties:
 *            productVariantId:
 *              type: "integer"
 *              description: "Id của sku"
 *            quantity:
 *              type: "integer"
 *              description: "Số lượng"
 *            warehouseId:
 *              type: "integer"
 *              description: "Giá bán"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.put('/', CartController.update);

/**
 * @openapi
 * /u/carts/{productVariantId}:
 *   delete:
 *     tags:
 *      - "[USER] CARTS"
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     parameters:
 *      - in: "path"
 *        type: "integer"
 *        name: "productVariantId"
 *        description: "Id của sku"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.delete('/:productVariantId', CartController.delete);

export default router;
