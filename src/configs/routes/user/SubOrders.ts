import SubOrdersController from '@controllers/api/user/SubOrdersController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/sub_orders/:
 *   get:
 *     tags:
 *      - "[USER] SUB ORDER"
 *     summary: danh sach
 *     parameters:
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
 *         description: Return data.
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Error can't get data.
 *     security:
 *      - Bearer: []
 */
router.get('/', SubOrdersController.index);

/**
 * @openapi
 * /u/sub_orders/{subOrderId}:
 *   get:
 *     tags:
 *      - "[USER] SUB ORDER"
 *     summary: Chi tiết order
 *     parameters:
 *      - in: path
 *        name: "subOrderId"
 *        description: "subOrderId"
 *        type: number
 *     responses:
 *       200:
 *         description: Return data.
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Error can't get data.
 *     security:
 *      - Bearer: []
 */
router.get('/:subOrderId', SubOrdersController.show);

export default router;
