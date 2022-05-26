import { Router } from 'express';
import SellerNotificationController from '@controllers/api/seller/SellerNotificationsController';

const router = Router();
/**
 * @openapi
 * /s/seller_notifications:
 *   get:
 *     tags:
 *      - "[SELLER] SELLER NOTIFICATIONS"
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
router.get('/', SellerNotificationController.index);

/**
 * @openapi
 * /s/seller_notifications/{notificationId}:
 *   get:
 *     tags:
 *      - "[SELLER] SELLER NOTIFICATIONS"
 *     summary: nội dung 1 notification
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
router.get('/:notificationId', SellerNotificationController.show);

/**
  * @openapi
  * /s/seller_notifications/{notificationId}/read:
  *   patch:
  *     tags:
  *      - "[SELLER] SELLER NOTIFICATIONS"
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
router.patch('/:notificationId/read', SellerNotificationController.read);

/**
  * @openapi
  * /s/seller_notifications/read_all:
  *   patch:
  *     tags:
  *      - "[SELLER] SELLER NOTIFICATIONS"
  *     summary: Đánh dấu đã đọc toàn bộ notification
  *     responses:
  *       200:
  *         description: Return data.
  *       500:
  *         description: Internal error.
  *     security:
  *      - Bearer: []
  */
router.patch('/read_all', SellerNotificationController.readAll);

/**
  * @openapi
  * /s/seller_notifications/{notificationId}:
  *   delete:
  *     tags:
  *      - "[SELLER] SELLER NOTIFICATIONS"
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
router.delete('/:notificationId', SellerNotificationController.delete);

/**
  * @openapi
  * /s/seller_notifications/:
  *   delete:
  *     tags:
  *      - "[SELLER] SELLER NOTIFICATIONS"
  *     summary: Xóa toàn bộ notification
  *     responses:
  *       200:
  *         description: Return data.
  *       500:
  *         description: Internal error.
  *     security:
  *      - Bearer: []
  */
router.delete('/', SellerNotificationController.deleteAll);

export default router;
