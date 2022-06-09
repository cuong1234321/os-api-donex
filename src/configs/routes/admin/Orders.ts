import OrdersController from '@controllers/api/admin/OrdersController';
import { Request, Response, Router } from 'express';
import Authorization from '@middlewares/authorization';

const router = Router();

/**
 * @openapi
 * /a/orders/:
 *   get:
 *     tags:
 *      - "[ADMIN] ORDERS"
 *     summary: Danh sách order con
 *     description: Danh sách order con
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "number"
 *      - in: query
 *        name: "size"
 *        description: "size"
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
router.get('/', Authorization.permit(OrdersController.constructor.name, 'index'), (req: Request, res: Response) => OrdersController.index(req, res));

/**
 * @openapi
 * /a/orders/download:
 *   get:
 *     tags:
 *      - "[ADMIN] ORDERS"
 *     summary: download orders
 *     parameters:
 *      - in: query
 *        name: "subOrderIds"
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/download', Authorization.permit(OrdersController.constructor.name, 'download'), (req: Request, res: Response) => OrdersController.download(req, res));

/**
 * @openapi
 * /a/orders/{orderId}:
 *   get:
 *     tags:
 *      - "[ADMIN] ORDERS"
 *     summary: chi tiet order
 *     parameters:
 *      - in: path
 *        name: "orderId"
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
router.get('/:orderId', Authorization.permit(OrdersController.constructor.name, 'show'), (req: Request, res: Response) => OrdersController.show(req, res));

/**
 * @openapi
 * /a/orders:
 *   post:
 *     tags:
 *      - "[ADMIN] ORDERS"
 *     summary: Tạo order
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin order"
 *        schema:
 *          type: "object"
 *          properties:
 *            orderableType:
 *              type: "string"
 *              description: "Loai khach hang"
 *              enum:
 *               - user
 *               - collaborator
 *               - agency
 *               - distributor
 *            orderableId:
 *              type: "number"
 *              description: "id khach hang"
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
 *              type: "number"
 *              description: "địa chỉ mua hàng"
 *              default: "null"
 *              require: true
 *            shippingDistrictId:
 *              type: "number"
 *              description: "địa chỉ mua hàng"
 *              default: "null"
 *              require: true
 *            shippingWardId:
 *              type: "number"
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
 *                  deposit:
 *                    type: "number"
 *                    description: "Tien dat coc"
 *                  deliveryType:
 *                    type: "string"
 *                    description: "loai don vi van chuyen"
 *                    enum:
 *                     - personal
 *                     - partner
 *                  deliveryInfo:
 *                    type: "string"
 *                    description: "thong tin doi tac"
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
router.post('/', Authorization.permit(OrdersController.constructor.name, 'create'), (req: Request, res: Response) => OrdersController.create(req, res));

/**
 * @openapi
 * /a/orders/calculator_ranks:
 *   post:
 *     tags:
 *      - "[ADMIN] ORDERS"
 *     summary: tinh chiet khau theo hang khach hang
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin order"
 *        schema:
 *          type: "object"
 *          properties:
 *            orderableType:
 *              type: "string"
 *              description: "Loai khach hang"
 *              enum:
 *               - user
 *               - collaborator
 *               - agency
 *               - distributor
 *            orderableId:
 *              type: "number"
 *              description: "id khach hang"
 *            totalQuantity:
 *              type: "number"
 *              description: "tong so luong"
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
router.post('/calculator_ranks', (req: Request, res: Response) => OrdersController.calculatorRankDiscount(req, res));

/**
 * @openapi
 * /a/orders/calculator_vouchers:
 *   post:
 *     tags:
 *      - "[ADMIN] ORDERS"
 *     summary: Tinh gia tri giam gia cho voucher
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin order"
 *        schema:
 *          type: "object"
 *          properties:
 *            orderableType:
 *              type: "string"
 *              description: "Loai khach hang"
 *              enum:
 *               - user
 *               - collaborator
 *               - agency
 *               - distributor
 *            orderableId:
 *              type: "number"
 *              description: "id khach hang"
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
router.post('/calculator_vouchers', (req: Request, res: Response) => OrdersController.calculatorVoucher(req, res));

/**
 * @openapi
 * /a/orders/{orderId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] ORDERS"
 *     summary: Sua order
 *     parameters:
 *      - in: "path"
 *        name: "orderId"
 *        description: "id order"
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin order"
 *        schema:
 *          type: "object"
 *          properties:
 *            orderableType:
 *              type: "string"
 *              description: "Loai khach hang"
 *              enum:
 *               - user
 *               - collaborator
 *               - agency
 *               - distributor
 *            orderableId:
 *              type: "number"
 *              description: "id khach hang"
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
 *                  id:
 *                    type: "integer"
 *                    description: "id order con"
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
 *                  deposit:
 *                    type: "number"
 *                    description: "Tien dat coc"
 *                  deliveryType:
 *                    type: "string"
 *                    description: "loai don vi van chuyen"
 *                    enum:
 *                     - personal
 *                     - partner
 *                  deliveryInfo:
 *                    type: "string"
 *                    description: "thong tin doi tac"
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
 *                        id:
 *                          type: "number"
 *                          description: "id item"
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
router.patch('/:orderId', Authorization.permit(OrdersController.constructor.name, 'update'), (req: Request, res: Response) => OrdersController.update(req, res));

/**
 * @openapi
 * /a/orders/{orderId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] ORDERS"
 *     summary: xoa don hang
 *     description: xoa don hang
 *     parameters:
 *      - in: path
 *        name: "orderId"
 *        description: "orderId"
 *        type: "number"
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
router.delete('/:orderId', Authorization.permit(OrdersController.constructor.name, 'delete'), OrdersController.delete);

export default router;
