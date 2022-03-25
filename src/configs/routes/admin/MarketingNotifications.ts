import { Router } from 'express';
import MarketingNotificationController from '@controllers/api/admin/MarketingNotificationsController';

const router = Router();

/**
 * @openapi
 * /a/notifications:
 *   get:
 *     tags:
 *      - "[ADMIN] Notifications"
 *     summary: Lấy danh sách thông báo
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "string"
 *      - in: query
 *        name: "limit"
 *        description: "số bản ghi trong 1 trang"
 *        type: "string"
 *      - in: query
 *        name: "status"
 *        description: "status"
 *        type: "string"
 *      - in: query
 *        name: "freeWord"
 *        description: "Tìm kiếm theo tên thông báo, tên người tạo"
 *        type: "string"
 *      - in: query
 *        name: "listTarget"
 *        description: "list id notificationTarget (cách nhau bởi dấu , )"
 *        type: "string"
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/', MarketingNotificationController.index);

/**
 * @openapi
 * /a/notifications/{notificationId}:
 *   get:
 *     tags:
 *      - "[ADMIN] Notifications"
 *     summary: Hiển thị chi tiết thông báo
 *     parameters:
 *      - in: path
 *        name: notificationId
 *        type: integer
 *        require: true
 *     responses:
 *       200:
 *         description: "OK"
 *       404:
 *         description: "Không tìm thấy thông báo thoả mãn"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/:notificationId', MarketingNotificationController.show);

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
 *                  type:
 *                    type: "string"
 *                    description: "kiểu đối tượng nhận thông báo"
 *                    enum:
 *                      - userType
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

/**
 * @openapi
 * /a/notifications/{notificationId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] Notifications"
 *     summary: Sửa Thông báo
 *     parameters:
 *      - in: path
 *        name: notificationId
 *        type: integer
 *        require: true
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
 *            sendAt:
 *              type: "string"
 *              description: "thời gian gửi (nếu hẹn lịch)"
 *            notificationTargets:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  id:
 *                    type: number
 *                  targetId:
 *                    type: number
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
router.patch('/:notificationId', MarketingNotificationController.update);

/**
 * @openapi
 * /a/notifications/{notificationId}/send_now:
 *   patch:
 *     tags:
 *      - "[ADMIN] Notifications"
 *     summary: Gửi ngay
 *     parameters:
 *      - in: path
 *        name: notificationId
 *        type: integer
 *        require: true
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.patch('/:notificationId/send_now', MarketingNotificationController.sendNow);

export default router;
