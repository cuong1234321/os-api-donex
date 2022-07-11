import OrderController from '@controllers/api/seller/OrdersController';
import { Request, Response, Router } from 'express';

const router = Router();

/**
 * @openapi
 * /s/orders/:
 *   get:
 *     tags:
 *      - "[SELLER] ORDERS"
 *     summary: Danh sách order con
 *     description: Danh sách order con
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "number"
 *      - in: query
 *        name: "code"
 *        description: "ma don"
 *        type: "string"
 *      - in: query
 *        name: "paymentStatus"
 *        description: "trang thai thanh toan"
 *        type: "string"
 *        enum:
 *         - pending
 *         - complete
 *      - in: query
 *        name: "status"
 *        description: "trang thai van chuyen"
 *        type: "string"
 *      - in: query
 *        name: "saleChannel"
 *        description: "kenh ban hang"
 *        type: "string"
 *        enum:
 *         - facebook
 *         - lazada
 *         - shopee
 *         - tiki
 *         - wholesale
 *         - retail
 *         - other
 *      - in: query
 *        name: "createAbleName"
 *        description: "Nhan vien ban hang"
 *        type: "string"
 *      - in: query
 *        name: "shippingName"
 *        description: "Nguoi nhan"
 *        type: "string"
 *      - in: query
 *        name: "subTotal"
 *        description: "Tong thanh toan. operator[eq(=), gte(>=), lte(<=)]"
 *        default: 'value,operator'
 *        type: "string"
 *      - in: query
 *        name: "finalAmount"
 *        description: "Còn phải thu. operator[eq(=), gte(>=), lte(<=)]"
 *        default: 'value,operator'
 *        type: "string"
 *      - in: query
 *        name: "pickUpAt"
 *        description: "Ngay giao hang"
 *        type: "YYYY/MM/DD"
 *      - in: query
 *        name: "phoneNumber"
 *        description: "SDT nguoi nhan"
 *        type: "string"
 *      - in: query
 *        name: "createdAt"
 *        description: "Ngay tao don"
 *        type: "YYYY/MM/DD"
 *      - in: query
 *        name: "shippingFee"
 *        description: "Phi GH thu khach. operator[eq(=), gte(>=), lte(<=)]"
 *        default: 'value,operator'
 *        type: "string"
 *      - in: query
 *        name: "shippingType"
 *        description: "Don vi van chuyen"
 *        type: "string"
 *      - in: query
 *        name: "shippingCode"
 *        description: "Ma van don"
 *        type: "string"
 *      - in: query
 *        name: "orderPartnerCode"
 *        description: "Ma don doi tac"
 *        type: "string"
 *      - in: query
 *        name: "paymentMethod"
 *        description: "Phuong thuc thanh toan"
 *        type: "string"
 *        enum:
 *         - banking
 *         - COD
 *         - vnPay
 *         - wallet
 *      - in: query
 *        name: "shippingFeeMisa"
 *        description: "Phi giao hang. operator[eq(=), gte(>=), lte(<=)]"
 *        default: 'value,operator'
 *        type: "string"
 *     responses:
 *       200:
 *         description: "success"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/', (req: Request, res: Response) => OrderController.index(req, res));

/**
 * @openapi
 * /s/orders/affiliate:
 *   get:
 *     tags:
 *      - "[SELLER] ORDERS"
 *     summary: Danh sách order con affiliate
 *     description: Danh sách order con affiliate
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "number"
 *      - in: query
 *        name: "code"
 *        description: "ma don"
 *        type: "string"
 *      - in: query
 *        name: "paymentStatus"
 *        description: "trang thai thanh toan"
 *        type: "string"
 *        enum:
 *         - pending
 *         - complete
 *      - in: query
 *        name: "status"
 *        description: "trang thai van chuyen"
 *        type: "string"
 *      - in: query
 *        name: "saleChannel"
 *        description: "kenh ban hang"
 *        type: "string"
 *        enum:
 *         - facebook
 *         - lazada
 *         - shopee
 *         - tiki
 *         - wholesale
 *         - retail
 *         - other
 *      - in: query
 *        name: "createAbleName"
 *        description: "Nhan vien ban hang"
 *        type: "string"
 *      - in: query
 *        name: "shippingName"
 *        description: "Nguoi nhan"
 *        type: "string"
 *      - in: query
 *        name: "subTotal"
 *        description: "Tong thanh toan. operator[eq(=), gte(>=), lte(<=)]"
 *        default: 'value,operator'
 *        type: "string"
 *      - in: query
 *        name: "finalAmount"
 *        description: "Còn phải thu. operator[eq(=), gte(>=), lte(<=)]"
 *        default: 'value,operator'
 *        type: "string"
 *      - in: query
 *        name: "pickUpAt"
 *        description: "Ngay giao hang"
 *        type: "YYYY/MM/DD"
 *      - in: query
 *        name: "phoneNumber"
 *        description: "SDT nguoi nhan"
 *        type: "string"
 *      - in: query
 *        name: "createdAt"
 *        description: "Ngay tao don"
 *        type: "YYYY/MM/DD"
 *      - in: query
 *        name: "shippingFee"
 *        description: "Phi GH thu khach. operator[eq(=), gte(>=), lte(<=)]"
 *        default: 'value,operator'
 *        type: "string"
 *      - in: query
 *        name: "shippingType"
 *        description: "Don vi van chuyen"
 *        type: "string"
 *      - in: query
 *        name: "shippingCode"
 *        description: "Ma van don"
 *        type: "string"
 *      - in: query
 *        name: "orderPartnerCode"
 *        description: "Ma don doi tac"
 *        type: "string"
 *      - in: query
 *        name: "paymentMethod"
 *        description: "Phuong thuc thanh toan"
 *        type: "string"
 *        enum:
 *         - banking
 *         - COD
 *         - vnPay
 *         - wallet
 *      - in: query
 *        name: "shippingFeeMisa"
 *        description: "Phi giao hang. operator[eq(=), gte(>=), lte(<=)]"
 *        default: 'value,operator'
 *        type: "string"
 *     responses:
 *       200:
 *         description: "success"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/affiliate', (req: Request, res: Response) => OrderController.indexAffiliate(req, res));

/**
 * @openapi
 * /s/orders/{orderId}/sub_orders/{subOrderId}:
 *   get:
 *     tags:
 *      - "[SELLER] ORDERS"
 *     summary: chi tiet order
 *     parameters:
 *      - in: path
 *        name: "orderId"
 *        description: ""
 *        type: number
 *      - in: path
 *        name: "subOrderId"
 *        description: ""
 *        type: number
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/:orderId/sub_orders/:subOrderId', (req: Request, res: Response) => OrderController.show(req, res));

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
 *                        sellingPrice:
 *                          type: "integer"
 *                          description: "Giá"
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.post('/', (req: Request, res: Response) => OrderController.create(req, res));

/**
 * @openapi
 * /s/orders/calculator_ranks:
 *   post:
 *     tags:
 *      - "[SELLER] ORDERS"
 *     summary: tinh chiet khau theo hang khach hang
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin order"
 *        schema:
 *          type: "object"
 *          properties:
 *            totalPrice:
 *              type: "number"
 *              description: "tong gia"
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.post('/calculator_ranks', (req: Request, res: Response) => OrderController.calculatorRankDiscount(req, res));

/**
  * @openapi
  * /s/orders/calculator_vouchers:
  *   post:
  *     tags:
  *      - "[SELLER] ORDERS"
  *     summary: Tinh gia tri giam gia cho voucher
  *     parameters:
  *      - in: "body"
  *        name: "body"
  *        description: "Thông tin order"
  *        schema:
  *          type: "object"
  *          properties:
  *            appliedVoucherId:
  *              type: "number"
  *              description: "id voucher user"
  *            totalPrice:
  *              type: "number"
  *              description: "tong gia"
  *            paymentMethod:
  *              type: "string"
  *              description: "phuong thuc thanh toan"
  *              enum:
  *               - banking
  *               - COD
  *               - vnPay
  *               - wallet
  *     responses:
  *       200:
  *         description: "OK"
  *       500:
  *         description: "Internal error"
  *     security:
  *      - Bearer: []
  */
router.post('/calculator_vouchers', (req: Request, res: Response) => OrderController.calculatorVoucher(req, res));

/**
  * @openapi
  * /s/orders/{orderId}/sub_orders/{subOrderId}/confirm_admin_order_status:
  *   patch:
  *     tags:
  *      - "[SELLER] ORDERS"
  *     summary: xac nhan don hang dat ho
  *     parameters:
  *      - in: "path"
  *        name: "orderId"
  *        description: "Thông tin order"
  *      - in: "path"
  *        name: "subOrderId"
  *        description: "Thông tin order"
  *     responses:
  *       200:
  *         description: "OK"
  *       500:
  *         description: "Internal error"
  *     security:
  *      - Bearer: []
  */
router.patch('/:orderId/sub_orders/:subOrderId/confirm_admin_order_status', (req: Request, res: Response) => OrderController.confirmAdminOrderStatus(req, res));

export default router;
