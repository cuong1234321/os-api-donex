import OrderFeedbacksController from '@controllers/api/user/OrderFeedbacksController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/order_feedbacks:
 *   get:
 *     tags:
 *      - "[USER] FEEDBACKS"
 *     summary: "danh sach phan hoi"
 *     parameters:
 *      - in: "query"
 *        name: "subOrderId"
 *        type: number
 *        description: "ma don hang"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/', OrderFeedbacksController.index);

/**
 * @openapi
 * /u/order_feedbacks:
 *   patch:
 *     tags:
 *      - "[USER] FEEDBACKS"
 *     summary: "tao moi phan hoi"
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "thong tin phan hoi"
 *        schema:
 *          type: "object"
 *          properties:
 *            subOrderId:
 *              type: "number"
 *            content:
 *              type: "string"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/', OrderFeedbacksController.create);

export default router;
