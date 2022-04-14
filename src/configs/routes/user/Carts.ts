import CartController from '@controllers/api/user/CartsController';
import { Request, Response, Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/carts:
 *   get:
 *     tags:
 *      - "[USER] CARTS"
 *     summary: Chi tiết giỏ hàng
 *     parameters:
 *      - in: "query"
 *        type: "number"
 *        name: "coins"
 *        description: "điểm thưởng"
 *      - in: "query"
 *        type: "number"
 *        name: "voucherId"
 *        description: "id voucher"
 *      - in: "query"
 *        type: "number"
 *        name: "wardId"
 *        description: "id ward"
 *      - in: "query"
 *        type: "number"
 *        name: "districtId"
 *        description: "id district"
 *      - in: "query"
 *        type: "number"
 *        name: "provinceId"
 *        description: "id province"
 *      - in: "query"
 *        type: "number"
 *        name: "address"
 *        description: "id province"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.get('/', (req: Request, res: Response) => CartController.show(req, res));

/**
 * @openapi
 * /u/carts/info:
 *   get:
 *     tags:
 *      - "[USER] CARTS"
 *     summary: Giỏ hàng, số lượng
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.get('/info', (req: Request, res: Response) => CartController.info(req, res));

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
 *              description: "Kho"
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
 * /u/carts/{productVariantId}/warehouse/{warehouseId}:
 *   delete:
 *     tags:
 *      - "[USER] CARTS"
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     parameters:
 *      - in: "path"
 *        type: "integer"
 *        name: "productVariantId"
 *        description: "Id của sku"
 *      - in: "path"
 *        type: "integer"
 *        name: "warehouseId"
 *        description: "warehouseId"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.delete('/:productVariantId/warehouse/:warehouseId', CartController.delete);

/**
 * @openapi
 * /u/carts/:
 *   delete:
 *     tags:
 *      - "[USER] CARTS"
 *     summary: Empty cart
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */

router.delete('/', CartController.empty);

export default router;
