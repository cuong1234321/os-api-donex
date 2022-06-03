import { Router } from 'express';
import MarketingNotificationController from '@controllers/api/admin/MarketingNotificationsController';
import { withoutSavingUploader } from '@middlewares/uploaders';
import Authorization from '@middlewares/authorization';

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
 *      - in: query
 *        name: "sortOrder"
 *        description: "Sắp xếp theo thứ tự"
 *        type: "string"
 *        enum:
 *          - "DESC"
 *          - "ASC"
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/', Authorization.permit(MarketingNotificationController.constructor.name, 'index'), MarketingNotificationController.index);

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
router.get('/:notificationId', Authorization.permit(MarketingNotificationController.constructor.name, 'show'), MarketingNotificationController.show);

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
router.post('/', Authorization.permit(MarketingNotificationController.constructor.name, 'create,uploadThumbnail'), MarketingNotificationController.create);

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
router.patch('/:notificationId', Authorization.permit(MarketingNotificationController.constructor.name, 'update,uploadThumbnail'), MarketingNotificationController.update);

/**
 * @openapi
 * /a/notifications/{notificationId}/upload_thumbnail:
 *   patch:
 *     tags:
 *      - "[ADMIN] Notifications"
 *     summary: Tải lên thumbnail
 *     consumes:
 *      - "multipart/form-data"
 *     produces:
 *      - "application/json"
 *     parameters:
 *      - in: "formData"
 *        name: "thumbnail"
 *        description: "File upload"
 *        required: false
 *        allowMultiple: true
 *        type: "file"
 *      - in: "path"
 *        name: "notificationId"
 *        required: true
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.patch('/:notificationId/upload_thumbnail', Authorization.permit(MarketingNotificationController.constructor.name, 'update,uploadThumbnail'),
  withoutSavingUploader.single('thumbnail'), MarketingNotificationController.uploadThumbnail);

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
router.patch('/:notificationId/send_now', Authorization.permit(MarketingNotificationController.constructor.name, 'sendNow'), MarketingNotificationController.sendNow);

/**
 * @openapi
 * /a/notifications/{notificationId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] Notifications"
 *     summary: Xóa thông báo
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
router.delete('/:notificationId', Authorization.permit(MarketingNotificationController.constructor.name, 'delete'), MarketingNotificationController.delete);

export default router;
