import CartController from '@controllers/api/user/CartsController';
import { Request, Response, Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/carts:
 *   post:
 *     tags:
 *      - "[USER] CARTS"
 *     summary: Chi tiết giỏ hàng
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin product"
 *        schema:
 *          type: "object"
 *          properties:
 *            coins:
 *              type: "number"
 *              description: "Số lượng coin sử dụng"
 *            voucherId:
 *              type: "number"
 *              description: "voucher của user"
 *            districtId:
 *              type: "number"
 *              description: "Địa chỉ quận huyện"
 *            provinceId:
 *              type: "number"
 *              description: "Địa chỉ thành phố"
 *            wardId:
 *              type: "number"
 *              description: "Địa chỉ phường xã"
 *            paymentMethod:
 *              type: "string"
 *              description: "Phương thức thanh toán"
 *              enum:
 *                - COD
 *                - VnPay
 *                - Banking
 *            transportUnit:
 *              type: "string"
 *              description: "Phương thức vận chuyển"
 *              enum:
 *                - GHN
 *                - VTP
 *            cartItems:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  warehouseId:
 *                    type: "number"
 *                    description: "id warehouse"
 *                  productVariantIds:
 *                    type: "string"
 *                    description: "danh sách ngăn cách nhau bởi dấu phẩy"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.post('/', (req: Request, res: Response) => CartController.showCart(req, res));

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
