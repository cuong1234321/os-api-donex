import SubOrderController from '@controllers/api/admin/SubOrdersController';
import { Request, Response, Router } from 'express';

const router = Router();

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

export default router;
