import SubOrderController from '@controllers/api/admin/SubOrdersController';
import { withoutSavingUploader } from '@middlewares/uploaders';
import { Request, Response, Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/sub_orders/:
 *   get:
 *     tags:
 *      - "[ADMIN] SUB ORDERS"
 *     summary: danh sach don hang con
 *     parameters:
 *      - in: query
 *        name: "code"
 *        description: ""
 *        type: "string"
 *        default: ""
 *      - in: query
 *        name: "subOrderId"
 *        description: ""
 *        type: "number"
 *        default: ""
 *      - in: query
 *        name: "TransportUnit"
 *        description: ""
 *        type: "string"
 *        default: ""
 *        enum:
 *          - ghn
 *          - vtp
 *     responses:
 *       200:
 *         description: "success"
 *       500:
 *         description: "failed"
 *     security:
 *      - Bearer: []
 */
router.get('/', SubOrderController.index);

/**
 * @openapi
 * /a/sub_orders/item_variants:
 *   get:
 *     tags:
 *      - "[ADMIN] SUB ORDERS"
 *     summary: danh sach chi tiet cac don hang con
 *     parameters:
 *      - in: query
 *        name: "subOrderIds"
 *        description: ""
 *        type: "string"
 *        default: ""
 *        required: true
 *     responses:
 *       200:
 *         description: "success"
 *       500:
 *         description: "failed"
 *     security:
 *      - Bearer: []
 */
router.get('/item_variants', SubOrderController.indexItems);

/**
 * @openapi
 * /a/sub_orders/download:
 *   get:
 *     tags:
 *      - "[ADMIN] SUB ORDERS"
 *     summary: tai xuong danh sach chi tiet cac don hang con
 *     parameters:
 *      - in: query
 *        name: "subOrderIds"
 *        description: ""
 *        type: "string"
 *        default: ""
 *        required: true
 *     responses:
 *       200:
 *         description: "success"
 *       500:
 *         description: "failed"
 *     security:
 *      - Bearer: []
 */
router.get('/download', SubOrderController.download);

/**
 * @openapi
 * /a/sub_orders/{subOrderId}:
 *   get:
 *     tags:
 *      - "[ADMIN] SUB ORDERS"
 *     summary: chi tiet sub order
 *     parameters:
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
router.get('/:subOrderId', (req: Request, res: Response) => SubOrderController.show(req, res));

/**
 * @openapi
 * /a/sub_orders/{subOrderId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] SUB ORDERS"
 *     summary: c???p nh???t subOrder
 *     parameters:
 *      - in: path
 *        name: "subOrderId"
 *        description: ""
 *        type: number
 *      - in: "body"
 *        name: "body"
 *        description: "Th??ng tin subOrder"
 *        schema:
 *          type: "object"
 *          properties:
 *            status:
 *              type: "string"
 *              description: "tranjg thai suborder"
 *              default: "string"
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.patch('/:subOrderId', (req: Request, res: Response) => SubOrderController.update(req, res));

/**
 * @openapi
 * /a/sub_orders/{subOrderId}/update_fee:
 *   patch:
 *     tags:
 *      - "[ADMIN] SUB ORDERS"
 *     summary: update phi giao hang
 *     parameters:
 *      - in: path
 *        name: "subOrderId"
 *        description: ""
 *        type: number
 *      - in: "body"
 *        name: "body"
 *        description: "Th??ng tin subOrder"
 *        schema:
 *          type: "object"
 *          properties:
 *              weight:
 *                type: "number"
 *                description: "can nang"
 *              length:
 *                type: "number"
 *                description: "chieu dai"
 *              width:
 *                type: "number"
 *                description: "chieu rong"
 *              height:
 *                type: "integer"
 *                description: "chieu cao"
 *              pickUpAt:
 *                type: "string"
 *                description: "ngay giao hang YYYY/MM/DD"
 *              shippingFeeMisa:
 *                type: "number"
 *                description: "phi GH tra DT"
 *              shippingFee:
 *                type: "number"
 *                description: "phi GH thu khach"
 *              deposit:
 *                type: "number"
 *                description: "Tien dat coc"
 *              deliveryType:
 *                type: "string"
 *                description: "loai don vi van chuyen"
 *                enum:
 *                  - personal
 *                  - partner
 *              deliveryInfo:
 *                type: "string"
 *                description: "thong tin doi tac"
 *              note:
 *                type: "string"
 *                description: "ghi chu giao hang"
 *              shippingType:
 *                type: "string"
 *                description: "Doi tac van chuyen"
 *              shippingAttributeType:
 *                type: "string"
 *                description: "Loai dich vu"
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.patch('/:subOrderId/update_fee', (req: Request, res: Response) => SubOrderController.updateFee(req, res));

/**
 * @openapi
 * /a/sub_orders/{subOrderId}/update_other_discounts:
 *   patch:
 *     tags:
 *      - "[ADMIN] SUB ORDERS"
 *     summary: update giam gia khac
 *     parameters:
 *      - in: path
 *        name: "subOrderId"
 *        description: ""
 *        type: number
 *      - in: "body"
 *        name: "body"
 *        description: "Th??ng tin subOrder"
 *        schema:
 *          type: "object"
 *          properties:
 *            otherDiscounts:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  key:
 *                    type: "string"
 *                    description: "ten giam gia"
 *                  value:
 *                    type: "integer"
 *                    description: "gia tri"
 *                  percent:
 *                    type: "number"
 *                    description: "%"
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.patch('/:subOrderId/update_other_discounts', (req: Request, res: Response) => SubOrderController.updateOtherdiscount(req, res));

/**
 * @openapi
 * /a/sub_orders/{subOrderId}/update_affiliate_status:
 *   patch:
 *     tags:
 *      - "[ADMIN] SUB ORDERS"
 *     summary: update trang thai doi soat affiliate
 *     parameters:
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
router.patch('/:subOrderId/update_affiliate_status', (req: Request, res: Response) => SubOrderController.updateAffiliateStatus(req, res));

/**
 * @openapi
 * /a/sub_orders/{subOrderId}/bill:
 *   get:
 *     tags:
 *      - "[ADMIN] SUB ORDERS"
 *     summary: xem hoa don
 *     parameters:
 *      - in: path
 *        name: "subOrderId"
 *        description: ""
 *        type: string
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/:subOrderId/bill', (req: Request, res: Response) => SubOrderController.showBill(req, res));

/**
 * @openapi
 * /a/sub_orders/{subOrderId}/approve_cancel:
 *   patch:
 *     tags:
 *      - "[ADMIN] SUB ORDERS"
 *     summary: X??c nh???n h???y h??ng
 *     parameters:
 *      - in: "path"
 *        name: "subOrderId"
 *        type: "integer"
 *     responses:
 *       200:
 *         description: "Success"
 *       500:
 *        description: Internal error
 *     security:
 *      - Bearer: []
 */
router.patch('/:subOrderId/approve_cancel', SubOrderController.approveCancel);

/**
  * @openapi
  * /a/sub_orders/{subOrderId}/reject_cancel:
  *   patch:
  *     tags:
  *      - "[ADMIN] SUB ORDERS"
  *     summary: T??? ch???i h???y h??ng
  *     parameters:
  *      - in: "path"
  *        name: "subOrderId"
  *        type: "integer"
  *      - in: "body"
  *        name: "body"
  *        schema:
  *          type: "object"
  *          properties:
  *            cancelRejectNote:
  *              type: "string"
  *              description: "L?? do t??? ch???i"
  *     responses:
  *       200:
  *         description: "Success"
  *       500:
  *        description: Internal error
  *     security:
  *      - Bearer: []
  */
router.patch('/:subOrderId/reject_cancel', SubOrderController.rejectCancel);

/**
 * @openapi
 * /a/sub_orders/upload_affiliate_status:
 *   post:
 *     tags:
 *      - "[ADMIN] SUB ORDERS"
 *     summary: cap nhat trang thanh doi soat
 *     consumes:
 *      - "multipart/form-data"
 *     produces:
 *      - "application/json"
 *     parameters:
 *      - in: "formData"
 *        name: "file"
 *        description: "File upload"
 *        required: true
 *        allowMultiple: false
 *        type: "file"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: L???i kh??ng x??c ?????nh
 *     security:
 *      - Bearer: []
 */
router.post('/upload_affiliate_status', withoutSavingUploader.single('file'), SubOrderController.uploadAffiliateStatus);

export default router;
