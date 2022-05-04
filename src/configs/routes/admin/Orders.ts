import OrdersController from '@controllers/api/admin/OrdersController';
import { Request, Response, Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/orders/:
 *   get:
 *     tags:
 *      - "[ADMIN] Orders"
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
router.get('/', (req: Request, res: Response) => OrdersController.index(req, res));

/**
 * @openapi
 * /a/orders:
 *   post:
 *     tags:
 *      - "[ADMIN] Orders"
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
router.post('/', (req: Request, res: Response) => OrdersController.create(req, res));

export default router;
