import OrderFeedbacksController from '@controllers/api/admin/OrderFeedbacksController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/order_feedbacks/{feedbackId}:
 *   get:
 *     tags:
 *      - "[ADMIN] FEEDBACKS"
 *     summary: "xem chi tiet 1 phan hoi"
 *     parameters:
 *      - in: path
 *        name: "feedbackId"
 *        description: "ma phan hoi"
 *        type: number
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/:feedbackId', OrderFeedbacksController.show);

/**
 * @openapi
 * /a/order_feedbacks/{feedbackId}/confirm:
 *   patch:
 *     tags:
 *      - "[ADMIN] FEEDBACKS"
 *     summary: "xu ly phan hoi"
 *     parameters:
 *      - in: path
 *        name: "feedbackId"
 *        description: "ma phan hoi"
 *        type: number
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/:feedbackId/confirm', OrderFeedbacksController.confirm);

/**
 * @openapi
 * /a/order_feedbacks/{feedbackId}/reject:
 *   patch:
 *     tags:
 *      - "[ADMIN] FEEDBACKS"
 *     summary: "tu choi phan hoi"
 *     parameters:
 *      - in: path
 *        name: "feedbackId"
 *        description: "ma phan hoi"
 *        type: number
 *      - in: "body"
 *        name: "body"
 *        description: "lý do từ chối"
 *        schema:
 *          type: "object"
 *          properties:
 *            rejectReason:
 *              type: "string"
 *              description: "lý do từ chối"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/:feedbackId/reject', OrderFeedbacksController.reject);

export default router;
