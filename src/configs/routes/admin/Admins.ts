import { Router } from 'express';
import AdminsController from '@controllers/api/admin/AdminsController';
import { withoutSavingUploader } from '@middlewares/uploaders';
import { adminPassport } from '@middlewares/passport';
import Authorization from '@middlewares/authorization';

const router = Router();

/**
 * @openapi
 * /a/admins/:
 *   get:
 *     tags:
 *      - "[ADMIN] ADMINS"
 *     summary: Danh sách admin
 *     description: Danh sách admin
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
router.get('/', Authorization.permit(AdminsController.constructor.name, 'index'), AdminsController.index);

/**
 * @openapi
 * /a/admins/admins_template:
 *   get:
 *     tags:
 *      - "[ADMIN] ADMINS"
 *     summary: Tải xuống template danh sách nhân viên
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/admins_template', AdminsController.downloadAdminTemplate);

/**
 * @openapi
 * /a/admins/download:
 *   get:
 *     tags:
 *      - "[ADMIN] ADMINS"
 *     summary: download admins
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/download', AdminsController.download);

/**
 * @openapi
 * /a/admins/{adminId}:
 *   get:
 *     tags:
 *      - "[ADMIN] ADMINS"
 *     summary: Chi tiet admin
 *     description: Chi tiet admin
 *     parameters:
 *      - in: path
 *        name: "adminId"
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
router.get('/:adminId', Authorization.permit(AdminsController.constructor.name, 'show'), AdminsController.show);

/**
 * @openapi
 * /a/admins:
 *   post:
 *     tags:
 *      - "[ADMIN] ADMINS"
 *     summary: Thêm mới admin
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin admin"
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
router.post('/', Authorization.permit(AdminsController.constructor.name, 'create'), AdminsController.create);

/**
 * @openapi
 * /a/admins/upload:
 *   post:
 *     tags:
 *      - "[ADMIN] ADMINS"
 *     summary: upload admin
 *     consumes:
 *      - "multipart/form-data"
 *     produces:
 *      - "application/json"
 *     parameters:
 *      - in: "formData"
 *        name: "file"
 *        description: "File upload"
 *        required: true
 *        allowMultiple: false
 *        type: "file"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.post('/upload', adminPassport.authenticate('jwt', { session: false }), withoutSavingUploader.single('file'), AdminsController.uploadAdmins);

/**
 * @openapi
 * /a/admins/{adminId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] ADMINS"
 *     summary: Cap nhat admin
 *     parameters:
 *      - in: path
 *        name: "adminId"
 *        type: "number"
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin admin"
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
router.patch('/:adminId', Authorization.permit(AdminsController.constructor.name, 'update'), AdminsController.update);

/**
 * @openapi
 * /a/admins/{adminId}/active:
 *   patch:
 *     tags:
 *      - "[ADMIN] ADMINS"
 *     summary: Mo hoat dong nhan vien
 *     parameters:
 *      - in: "path"
 *        name: "adminId"
 *        type: "integer"
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
router.patch('/:adminId/active', Authorization.permit(AdminsController.constructor.name, 'active'), AdminsController.active);

/**
  * @openapi
  * /a/admins/{adminId}/inactive:
  *   patch:
  *     tags:
  *      - "[ADMIN] ADMINS"
  *     summary: Khoa tai khoan nhan vien
  *     parameters:
  *      - in: "path"
  *        name: "adminId"
  *        type: "integer"
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
router.patch('/:adminId/inactive', Authorization.permit(AdminsController.constructor.name, 'inActive'), AdminsController.inActive);

/**
 * @openapi
 * /a/admins/{adminId}/change_password:
 *   patch:
 *     tags:
 *      - "[ADMIN] ADMINS"
 *     summary: thay doi password
 *     parameters:
 *      - in: path
 *        name: "adminId"
 *        type: "number"
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin admin"
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
router.patch('/:adminId/change_password', Authorization.permit(AdminsController.constructor.name, 'changePassword'), AdminsController.changePassword);

/**
 * @openapi
 * /a/admins/{adminId}/avatar:
 *   patch:
 *     tags:
 *      - "[ADMIN] ADMINS"
 *     summary: Upload avatar cho admin
 *     consumes:
 *      - "multipart/form-data"
 *     produces:
 *      - "application/json"
 *     parameters:
 *      - in: "path"
 *        name: "adminId"
 *        required: true
 *        type: "number"
 *      - in: "formData"
 *        name: "avatar"
 *        description: "File upload"
 *        required: false
 *        type: "file"
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
router.patch('/:adminId/avatar', Authorization.permit(AdminsController.constructor.name, 'uploadAvatar'),
  withoutSavingUploader.single('avatar'),
  AdminsController.uploadAvatar);

/**
 * @openapi
 * /a/admins/{adminId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] ADMINS"
 *     summary: thay doi password
 *     parameters:
 *      - in: path
 *        name: "adminId"
 *        type: "number"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.delete('/:adminId', Authorization.permit(AdminsController.constructor.name, 'delete'), AdminsController.delete);

export default router;
