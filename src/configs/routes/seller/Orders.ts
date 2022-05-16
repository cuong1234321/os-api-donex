import OrderController from '@controllers/api/seller/OrdersController';
import { Request, Response, Router } from 'express';

const router = Router();

/**
 * @openapi
 * /s/orders:
 *   post:
 *     tags:
 *      - "[SELLER] ORDERS"
 *     summary: Tạo order
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin order"
 *        schema:
 *          type: "object"
 *          properties:
 *            appliedVoucherId:
 *              type: "number"
 *              description: "id ma khuyen mai"
 *            saleChannel:
 *              type: "string"
 *              description: "kenh ban hang"
 *              enum:
 *               - facebook
 *               - lazada
 *               - shopee
 *               - tiki
 *               - wholesale
 *               - retail
 *               - other
 *              default: 'wholesale'
 *            saleCampaignId:
 *              type: "number"
 *              description: "id bang gia"
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
 *            paymentMethod:
 *              type: "string"
 *              description: "Phương thức thanh toán"
 *              default: 'COD'
 *              enum:
 *                - COD
 *                - banking
 *                - vnPay
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
 *                  weight:
 *                    type: "number"
 *                    description: "can nang"
 *                  length:
 *                    type: "number"
 *                    description: "chieu dai"
 *                  width:
 *                    type: "number"
 *                    description: "chieu rong"
 *                  height:
 *                    type: "integer"
 *                    description: "chieu cao"
 *                  pickUpAt:
 *                    type: "string"
 *                    description: "ngay giao hang YYYY/MM/DD"
 *                  shippingFeeMisa:
 *                    type: "number"
 *                    description: "phi GH tra DT"
 *                  shippingFee:
 *                    type: "number"
 *                    description: "phi GH thu khach"
 *                  note:
 *                    type: "string"
 *                    description: "ghi chu giao hang"
 *                  shippingType:
 *                    type: "string"
 *                    description: "Doi tac van chuyen"
 *                  shippingAttributeType:
 *                    type: "string"
 *                    description: "Loai dich vu"
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
router.post('/', (req: Request, res: Response) => OrderController.create(req, res));

export default router;
