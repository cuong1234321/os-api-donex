import OrdersController from '@controllers/api/user/OrdersController';
import { authGuest } from '@middlewares/auth';
import { userPassport } from '@middlewares/passport';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/orders:
 *   post:
 *     tags:
 *      - "[USER] ORDER"
 *     summary: Tạo order
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin order"
 *        schema:
 *          type: "object"
 *          properties:
 *            paymentMethod:
 *              type: "string"
 *              description: "Phương thức thanh toán"
 *              default: 'COD'
 *              enum:
 *                - COD
 *                - banking
 *                - vnPay
 *            coinUsed:
 *              type: "integer"
 *              description: "xu sử dụng"
 *              default: "null"
 *              require: true
 *            shippingFullName:
 *              type: "string"
 *              description: "Tên người mua hàng"
 *              default: "string"
 *              require: true
 *            shippingPhoneNumber:
 *              type: "string"
 *              description: "sdt"
 *              default: "null"
 *              require: true
 *            shippingProvinceId:
 *              type: "string"
 *              description: "địa chỉ mua hàng"
 *              default: "null"
 *              require: true
 *            shippingDistrictId:
 *              type: "string"
 *              description: "địa chỉ mua hàng"
 *              default: "null"
 *              require: true
 *            shippingWardId:
 *              type: "string"
 *              description: "địa chỉ mua hàng"
 *              default: "null"
 *              require: true
 *            shippingAddress:
 *              type: "string"
 *              description: "địa chỉ mua hàng"
 *              default: "string"
 *              require: true
 *            appliedVoucherId:
 *              type: "number"
 *              description: "id voucher"
 *              default: "string"
 *              require: false
 *            note:
 *              type: "string"
 *              description: "ghi chu tu khach hang"
 *              default: "string"
 *              require: false
 *            referralCode:
 *              type: "string"
 *              description: "ma gioi thieu cua seller"
 *              default: "string"
 *            subOrders:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  warehouseId:
 *                    type: "integer"
 *                    description: "id kho"
 *                    default: "null"
 *                    require: true
 *                  deliveryType:
 *                    type: "string"
 *                    description: "thong tin"
 *                    default: "null"
 *                    require: true
 *                  deliveryInfo:
 *                    type: "string"
 *                    description: "thong tin"
 *                    default: "null"
 *                    require: true
 *                  shippingType:
 *                    type: "string"
 *                    description: "thong tin"
 *                    default: "null"
 *                    require: true
 *                  shippingAttributeType:
 *                    type: "string"
 *                    description: "thong tin"
 *                    default: "null"
 *                    require: true
 *                  items:
 *                    type: "array"
 *                    items:
 *                      type: "object"
 *                      properties:
 *                        productVariantId:
 *                          type: "integer"
 *                          description: "id variant"
 *                          default: "null"
 *                          require: true
 *                        quantity:
 *                          type: "integer"
 *                          description: "Số lượng"
 *                          default: "null"
 *                          require: true
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.post('/', authGuest, OrdersController.create);

/**
 * @openapi
 * /u/orders/view:
 *   post:
 *     tags:
 *      - "[USER] ORDER"
 *     summary: Tạo order
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin order"
 *        schema:
 *          type: "object"
 *          properties:
 *            paymentMethod:
 *              type: "string"
 *              description: "Phương thức thanh toán"
 *              default: 'COD'
 *              enum:
 *                - COD
 *                - banking
 *                - vnPay
 *            coinUsed:
 *              type: "integer"
 *              description: "xu sử dụng"
 *              default: "null"
 *              require: true
 *            shippingFullName:
 *              type: "string"
 *              description: "Tên người mua hàng"
 *              default: "string"
 *              require: true
 *            shippingPhoneNumber:
 *              type: "string"
 *              description: "sdt"
 *              default: "null"
 *              require: true
 *            shippingProvinceId:
 *              type: "integer"
 *              description: "địa chỉ mua hàng"
 *              default: "null"
 *              require: true
 *            shippingDistrictId:
 *              type: "integer"
 *              description: "địa chỉ mua hàng"
 *              default: "null"
 *              require: true
 *            shippingWardId:
 *              type: "integer"
 *              description: "địa chỉ mua hàng"
 *              default: "null"
 *              require: true
 *            shippingAddress:
 *              type: "string"
 *              description: "địa chỉ mua hàng"
 *              default: "string"
 *              require: true
 *            subOrders:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  warehouseId:
 *                    type: "integer"
 *                    description: "id kho"
 *                    default: "null"
 *                    require: true
 *                  deliveryType:
 *                    type: "string"
 *                    description: "thong tin"
 *                    default: "null"
 *                    require: true
 *                  deliveryInfo:
 *                    type: "string"
 *                    description: "thong tin"
 *                    default: "null"
 *                    require: true
 *                  shippingType:
 *                    type: "string"
 *                    description: "thong tin"
 *                    default: "null"
 *                    require: true
 *                  shippingAttributeType:
 *                    type: "string"
 *                    description: "thong tin"
 *                    default: "null"
 *                    require: true
 *                  items:
 *                    type: "array"
 *                    items:
 *                      type: "object"
 *                      properties:
 *                        productVariantId:
 *                          type: "integer"
 *                          description: "id variant"
 *                          default: "null"
 *                          require: true
 *                        quantity:
 *                          type: "integer"
 *                          description: "Số lượng"
 *                          default: "null"
 *                          require: true
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.post('/view', authGuest, OrdersController.show);

/**
 * @openapi
 * /u/orders/{orderId}/pay:
 *   post:
 *     tags:
 *      - "[USER] ORDER"
 *     summary: Thanh toán đơn hàng
 *     parameters:
 *      - in: "path"
 *        name: "orderId"
 *        description: "Id đơn hàng"
 *     responses:
 *       200:
 *         description: "Success"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.post('/:orderId/pay', userPassport.authenticate('jwt', { session: false }), OrdersController.createPayment);

export default router;
