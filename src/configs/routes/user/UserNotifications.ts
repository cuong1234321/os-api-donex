import { Router } from 'express';
import UserNotificationController from '@controllers/api/user/UserNotificationsController';

const router = Router();
/**
 * @openapi
 * /u/user_notifications:
 *   get:
 *     tags:
 *      - "[USER] UserNotifications"
 *     summary: lay thong tin thong bao
 *     parameters:
 *      - in: query
 *        name: page
 *      - in: query
 *        name: size
 *      - in: query
 *        name: type
 *        enum:
 *          - system
 *          - promotion
 *          - order
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
router.get('/', UserNotificationController.index);

/**
 * @openapi
 * /u/user_notifications/{notificationId}:
 *   get:
 *     tags:
 *      - "[USER] UserNotifications"
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
router.get('/:notificationId', UserNotificationController.show);

/**
  * @openapi
  * /u/user_notifications/{notificationId}/read:
  *   patch:
  *     tags:
  *      - "[USER] UserNotifications"
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
router.patch('/:notificationId/read', UserNotificationController.read);

/**
  * @openapi
  * /u/user_notifications/read_all:
  *   patch:
  *     tags:
  *      - "[USER] UserNotifications"
  *     summary: Đánh dấu đã đọc toàn bộ notification
  *     responses:
  *       200:
  *         description: Return data.
  *       500:
  *         description: Internal error.
  *     security:
  *      - Bearer: []
  */
router.patch('/read_all', UserNotificationController.readAll);

/**
  * @openapi
  * /u/user_notifications/{notificationId}:
  *   delete:
  *     tags:
  *      - "[USER] UserNotifications"
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
router.delete('/:notificationId', UserNotificationController.delete);

/**
  * @openapi
  * /u/user_notifications/:
  *   delete:
  *     tags:
  *      - "[USER] UserNotifications"
  *     summary: Xóa toàn bộ notification
  *     responses:
  *       200:
  *         description: Return data.
  *       500:
  *         description: Internal error.
  *     security:
  *      - Bearer: []
  */
router.delete('/', UserNotificationController.deleteAll);

export default router;
