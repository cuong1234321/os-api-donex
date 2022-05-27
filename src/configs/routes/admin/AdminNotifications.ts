import { Router } from 'express';
import AdminNotificationController from '@controllers/api/admin/AdminNotificationsController';

const router = Router();
/**
 * @openapi
 * /a/admin_notifications:
 *   get:
 *     tags:
 *      - "[ADMIN] ADMIN NOTIFICATIONS"
 *     summary: lay thong tin thong bao
 *     parameters:
 *      - in: query
 *        name: page
 *      - in: query
 *        name: size
 *     responses:
 *       200:
 *         description: Return data.
 *       404:
 *         description: not found
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/', AdminNotificationController.index);

/**
 * @openapi
 * /a/admin_notifications/{notificationId}:
 *   get:
 *     tags:
 *      - "[ADMIN] ADMIN NOTIFICATIONS"
 *     summary: List nội dung 1 notification
 *     parameters:
 *      - in: path
 *        name: notificationId
 *        required: true
 *        type: number
 *     responses:
 *       200:
 *         description: Return data.
 *       404:
 *         description: Không tìm thấy notification.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.get('/:notificationId', AdminNotificationController.show);

/**
  * @openapi
  * /a/admin_notifications/{notificationId}/read:
  *   patch:
  *     tags:
  *      - "[ADMIN] ADMIN NOTIFICATIONS"
  *     summary: Đọc notification
  *     parameters:
  *      - in: path
  *        name: notificationId
  *        required: true
  *        type: number
  *     responses:
  *       200:
  *         description: Return data.
  *       404:
  *         description: Không tìm thấy notification.
  *       500:
  *         description: Internal error.
  *     security:
  *      - Bearer: []
  */
router.patch('/:notificationId/read', AdminNotificationController.read);

/**
  * @openapi
  * /a/admin_notifications/read_all:
  *   patch:
  *     tags:
  *      - "[ADMIN] ADMIN NOTIFICATIONS"
  *     summary: Đánh dấu đã đọc toàn bộ notification
  *     responses:
  *       200:
  *         description: Return data.
  *       500:
  *         description: Internal error.
  *     security:
  *      - Bearer: []
  */
router.patch('/read_all', AdminNotificationController.readAll);

/**
  * @openapi
  * /a/admin_notifications/{notificationId}:
  *   delete:
  *     tags:
  *      - "[ADMIN] ADMIN NOTIFICATIONS"
  *     summary: Xóa notification
  *     parameters:
  *      - in: path
  *        name: notificationId
  *        required: true
  *        type: number
  *     responses:
  *       200:
  *         description: Return data.
  *       404:
  *         description: Không tìm thấy notification.
  *       500:
  *         description: Internal error.
  *     security:
  *      - Bearer: []
  */
router.delete('/:notificationId', AdminNotificationController.delete);

/**
  * @openapi
  * /a/admin_notifications/:
  *   delete:
  *     tags:
  *      - "[ADMIN] ADMIN NOTIFICATIONS"
  *     summary: Xóa toàn bộ notification
  *     responses:
  *       200:
  *         description: Return data.
  *       500:
  *         description: Internal error.
  *     security:
  *      - Bearer: []
  */
router.delete('/', AdminNotificationController.deleteAll);

export default router;
