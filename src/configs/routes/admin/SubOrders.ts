import SubOrderController from '@controllers/api/admin/SubOrdersController';
import { Request, Response, Router } from 'express';

const router = Router();

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

export default router;
