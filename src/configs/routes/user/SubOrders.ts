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
 *      - in: query
 *        name: "status"
 *        description: ""
 *        type: "string"
 *      - in: query
 *        name: "freeWord"
 *        description: ""
 *        type: "string"
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

/**
 * @openapi
 * /u/sub_orders/{subOrderId}/get_info:
 *   get:
 *     tags:
 *      - "[USER] SUB ORDER"
 *     summary: Chi tiết order lịch sử
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
router.get('/:subOrderId/get_info', SubOrdersController.getOrderPlatform);

export default router;
