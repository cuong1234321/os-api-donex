import { Router } from 'express';
import MarketingNotificationController from '@controllers/api/admin/MarketingNotificationsController';

const router = Router();

/**
 * @openapi
 * /a/notifications:
 *   post:
 *     tags:
 *      - "[ADMIN] Notifications"
 *     summary: Tạo mới Thông báo
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin thong bao"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *              description: "Tiêu đề tin tức"
 *            link:
 *              type: "string"
 *              description: "link tin tức"
 *            content:
 *              type: "string"
 *              description: "Nội dung tin tức"
 *            isSentImmediately:
 *              type: "boolean"
 *            sendAt:
 *              type: "string"
 *              description: "thời gian gửi (nếu hẹn lịch)"
 *            notificationTargets:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  targetId:
 *                    type: "integer"
 *                    description: "Id đối tượng nhận thông báo"
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
router.post('/', MarketingNotificationController.create);

export default router;
