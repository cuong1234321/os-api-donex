import UserController from '@controllers/api/admin/UsersController';
import { withoutSavingUploader } from '@middlewares/uploaders';
import { Router } from 'express';
import Authorization from '@middlewares/authorization';

const router = Router();

/**
 * @openapi
 * /a/users/:
 *   get:
 *     tags:
 *      - "[ADMIN] USERS"
 *     summary: Danh sách khách hàng
 *     description: Danh sách khách hàng
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "number"
 *      - in: query
 *        name: "size"
 *        description: "size"
 *        type: "number"
 *      - in: query
 *        name: "freeWord"
 *        description: "freeWord"
 *        type: "string"
 *      - in: query
 *        name: "gender"
 *        description: "gioi tinh"
 *        type: "string"
 *        enum:
 *         - male
 *         - female
 *         - other
 *      - in: query
 *        name: "status"
 *        description: "trang thai"
 *        type: "string"
 *        enum:
 *          - active
 *          - inactive
 *      - in: query
 *        name: "nameOrder"
 *        description: "sort"
 *        type: "enum"
 *        enum:
 *          - DESC
 *          - ASC
 *     responses:
 *       200:
 *         description: "Upload success"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/', Authorization.permit(UserController.constructor.name, 'index'), UserController.index);

/**
 * @openapi
 * /a/users/download:
 *   get:
 *     tags:
 *      - "[ADMIN] USERS"
 *     summary: Tải xuống danh sách khách hàng
 *     description: Tải xuống Danh sách khách hàng
 *     parameters:
 *      - in: query
 *        name: "freeWord"
 *        description: "freeWord"
 *        type: "string"
 *      - in: query
 *        name: "gender"
 *        description: "gioi tinh"
 *        type: "string"
 *        enum:
 *         - male
 *         - female
 *         - other
 *      - in: query
 *        name: "status"
 *        description: "trang thai"
 *        type: "string"
 *        enum:
 *          - active
 *          - inactive
 *     responses:
 *       200:
 *         description: "Upload success"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/download', Authorization.permit(UserController.constructor.name, 'index'), UserController.download);

/**
 * @openapi
 * /a/users/{userId}:
 *   get:
 *     tags:
 *      - "[ADMIN] USERS"
 *     summary: Chi tiet user
 *     description: Chi tiet user
 *     parameters:
 *      - in: path
 *        name: "userId"
 *        type: "number"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/:userId', Authorization.permit(UserController.constructor.name, 'show'), UserController.show);

/**
  * @openapi
  * /a/users:
  *   post:
  *     tags:
  *      - "[ADMIN] USERS"
  *     summary: Thêm mới khách hàng
  *     parameters:
  *      - in: "body"
  *        name: "body"
  *        description: "thông tin khách hàng"
  *        schema:
  *          type: "object"
  *          properties:
  *            phoneNumber:
  *              type: "string"
  *            fullName:
  *              type: "string"
  *            username:
  *              type: "string"
  *            email:
  *              type: "string"
  *            gender:
  *              type: "string"
  *              enum:
  *               - male
  *               - female
  *               - other
  *            dateOfBirth:
  *              type: "string"
  *              default: "2000/01/01"
  *            note:
  *              type: "string"
  *     responses:
  *       200:
  *         description: Return data.
  *       500:
  *         description: Lỗi không xác định
  *     security:
  *      - Bearer: []
  */
router.post('/', Authorization.permit(UserController.constructor.name, 'create,uploadAvatar'), UserController.create);

/**
 * @openapi
 * /a/users/{userId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] USERS"
 *     summary: Cap nhat user
 *     parameters:
 *      - in: path
 *        name: "userId"
 *        type: "number"
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin user"
 *        schema:
 *          type: "object"
 *          properties:
 *            phoneNumber:
 *              type: "string"
 *            fullName:
 *              type: "string"
 *            email:
 *              type: "string"
 *            gender:
 *              type: "string"
 *              enum:
 *               - male
 *               - female
 *               - other
 *            defaultRank:
 *              type: "string"
 *              enum:
 *               - Basic
 *               - Vip
 *            dateOfBirth:
 *              type: "string"
 *              default: "2000/01/01"
 *            note:
 *              type: "string"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/:userId', Authorization.permit(UserController.constructor.name, 'update,active,inactive,uploadAvatar,changePassword'), UserController.update);

/**
 * @openapi
 * /a/users/{userId}/change_password:
 *   patch:
 *     tags:
 *      - "[ADMIN] USERS"
 *     summary: thay doi password
 *     parameters:
 *      - in: path
 *        name: "userId"
 *        type: "number"
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin user"
 *        schema:
 *          type: "object"
 *          properties:
 *            password:
 *              type: "string"
 *              default: "Aa@123456"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/:userId/change_password', Authorization.permit(UserController.constructor.name, 'update,active,inactive,uploadAvatar,changePassword'), UserController.changePassword);

/**
  * @openapi
  * /a/users/{userId}/active:
  *   patch:
  *     tags:
  *      - "[ADMIN] USERS"
  *     summary: Mở khóa TK user
  *     parameters:
  *      - in: path
  *        name: "userId"
  *        description: "userId"
  *        type: "string"
  *     responses:
  *       200:
  *         description: Return data.
  *       500:
  *         description: Lỗi không xác định
  *     security:
  *      - Bearer: []
  */
router.patch('/:userId/active', Authorization.permit(UserController.constructor.name, 'update,active,inactive,uploadAvatar,changePassword'), UserController.active);

/**
  * @openapi
  * /a/users/{userId}/inactive:
  *   patch:
  *     tags:
  *      - "[ADMIN] USERS"
  *     summary: Khóa TK user
  *     parameters:
  *      - in: path
  *        name: "userId"
  *        description: "userId"
  *        type: "string"
  *     responses:
  *       200:
  *         description: Return data.
  *       500:
  *         description: Lỗi không xác định
  *     security:
  *      - Bearer: []
  */
router.patch('/:userId/inactive', Authorization.permit(UserController.constructor.name, 'update,active,inactive,uploadAvatar,changePassword'), UserController.inactive);

/**
  * @openapi
  * /a/users/{userId}/upload_avatar:
  *   patch:
  *     tags:
  *      - "[ADMIN] USERS"
  *     summary: Tải lên avatar
  *     consumes:
  *      - "multipart/form-data"
  *     produces:
  *      - "application/json"
  *     parameters:
  *      - in: "formData"
  *        name: "avatar"
  *        description: "File upload"
  *        required: false
  *        allowMultiple: true
  *        type: "file"
  *      - in: "path"
  *        name: "userId"
  *        required: true
  *     responses:
  *       200:
  *         description: "Upload success"
  *       500:
  *         description: "Upload failed"
  *     security:
  *      - Bearer: []
  */
router.patch('/:userId/upload_avatar', Authorization.permit(UserController.constructor.name, 'update,active,inactive,uploadAvatar,changePassword'),
  withoutSavingUploader.single('avatar'), UserController.uploadAvatar);

/**
  * @openapi
  * /a/users/{userId}:
  *   delete:
  *     tags:
  *      - "[ADMIN] USERS"
  *     summary: Xóa TK user
  *     parameters:
  *      - in: path
  *        name: "userId"
  *        description: "userId"
  *        type: "string"
  *     responses:
  *       200:
  *         description: Return data.
  *       500:
  *         description: Lỗi không xác định
  *     security:
  *      - Bearer: []
  */
router.delete('/:userId', Authorization.permit(UserController.constructor.name, 'delete'), UserController.delete);

export default router;
