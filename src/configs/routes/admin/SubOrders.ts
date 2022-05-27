import SubOrderController from '@controllers/api/admin/SubOrdersController';
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
 *     summary: cập nhật subOrder
 *     parameters:
 *      - in: path
 *        name: "subOrderId"
 *        description: ""
 *        type: number
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin subOrder"
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
 * /a/sub_orders/{subOrderId}/bill:
 *   get:
 *     tags:
 *      - "[ADMIN] SUB ORDERS"
 *     summary: xem hoa don
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
router.get('/:subOrderId/bill', (req: Request, res: Response) => SubOrderController.showBill(req, res));

/**
 * @openapi
 * /a/sub_orders/{subOrderId}/approve_cancel:
 *   patch:
 *     tags:
 *      - "[ADMIN] SUB ORDERS"
 *     summary: Xác nhận hủy hàng
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
  *     summary: Từ chối hủy hàng
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
  *              description: "Lý do từ chối"
  *     responses:
  *       200:
  *         description: "Success"
  *       500:
  *        description: Internal error
  *     security:
  *      - Bearer: []
  */
router.patch('/:subOrderId/reject_cancel', SubOrderController.rejectCancel);

export default router;
