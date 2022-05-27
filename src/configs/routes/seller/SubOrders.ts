import SubOrderController from '@controllers/api/seller/SubOrdersController';
import { Request, Response, Router } from 'express';

const router = Router();

/**
 * @openapi
 * /s/sub_orders/purchase_report:
 *   get:
 *     tags:
 *      - "[SELLER] SUB ORDERS"
 *     summary: bao cao mua hang
 *     parameters:
 *      - in: query
 *        name: "fromDate"
 *        description: ""
 *        type: string
 *      - in: query
 *        name: "toDate"
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
router.get('/purchase_report', (req: Request, res: Response) => SubOrderController.PurchaseReport(req, res));

/**
 * @openapi
 * /s/sub_orders/{subOrderId}:
 *   get:
 *     tags:
 *      - "[SELLER] SUB ORDERS"
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
 * /s/sub_orders/{subOrderId}/cancel:
 *   patch:
 *     tags:
 *      - "[SELLER] SUB ORDERS"
 *     summary: huy sub order
 *     parameters:
 *      - in: path
 *        name: "subOrderId"
 *        description: ""
 *        type: number
 *      - in: "body"
 *        name: "body"
 *        description: "ly do huy don"
 *        schema:
 *          type: "object"
 *          properties:
 *            cancelReason:
 *              type: "string"
 *              description: "ly do huy don"
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.patch('/:subOrderId/cancel', SubOrderController.cancel);

export default router;
