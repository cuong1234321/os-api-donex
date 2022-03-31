import CollaboratorsController from '@controllers/api/admin/CollaboratorsController';
import { withoutSavingUploader } from '@middlewares/uploaders';
import { Router } from 'express';

const router = Router();

// /**
//  * @openapi
//  * /a/collaborators:
//  *   get:
//  *     tags:
//  *      - "[ADMIN] Collaborators"
//  *     summary: Lấy danh sách danh CTV/DL/NPP
//  *     parameters:
//  *      - in: query
//  *        name: "page"
//  *        description: "page"
//  *        type: "string"
//  *      - in: query
//  *        name: "limit"
//  *        description: "số bản ghi trong 1 trang"
//  *        type: "string"
//  *      - in: query
//  *        name: "status"
//  *        description: "status"
//  *        type: "string"
//  *      - in: query
//  *        name: "freeWord"
//  *        description: "Tìm kiếm theo id, tên, username, sdt"
//  *        type: "string"
//  *      - in: query
//  *        name: "type"
//  *        description: "lọc theo loại CTV/DL/NPP"
//  *        type: "string"
//  *        enum:
//  *          - collaborator
//  *          - agency
//  *          - distributor
//  *     responses:
//  *       200:
//  *         description: "OK"
//  *       500:
//  *         description: "Internal error"
//  *     security:
//  *      - Bearer: []
//  */
// router.get('/', CollaboratorsController.index);

/**
 * @openapi
 * /a/collaborators:
 *   post:
 *     tags:
 *      - "[ADMIN] Collaborators"
 *     summary: Tạo TK CTV/ĐL/NPP
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin CTV"
 *        schema:
 *          type: "object"
 *          properties:
 *            fullName:
 *              type: "string"
 *            parentId:
 *              type: "number"
 *            dateOfBirth:
 *              type: "string"
 *              description: "YYYY-DD-MM"
 *            phoneNumber:
 *              type: "string"
 *            username:
 *              type: "string"
 *            password:
 *              type: "string"
 *            email:
 *              type: "string"
 *            provinceId:
 *              type: number
 *            districtId:
 *              type: number
 *            wardId:
 *              type: number
 *            address:
 *              type: "string"
 *            defaultRank:
 *              type: number
 *            type:
 *              type: "string"
 *              enum:
 *                 - collaborator
 *                 - agency
 *                 - distributor
 *            collaboratorWorkingDays:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  workingDay:
 *                    type: "string"
 *                    enum:
 *                      - monday
 *                      - tuesday
 *                      - wednesday
 *                      - thursday
 *                      - friday
 *                      - saturday
 *                      - sunday
 *            openTime:
 *              type: "string"
 *              description: "hhmmss"
 *              default: "070000"
 *            closeTime:
 *              type: "string"
 *              description: "hhmmss"
 *              default: "173000"
 *            collaboratorMedia:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  type:
 *                    type: "string"
 *                    enum:
 *                      - inside
 *                      - outside
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.post('/', CollaboratorsController.create);

/**
 * @openapi
 * /a/collaborators/{collaboratorId}/upload_paper_proof:
 *   post:
 *     tags:
 *      - "[ADMIN] Collaborators"
 *     summary: Tải lên ảnh CCCD
 *     consumes:
 *      - "multipart/form-data"
 *     produces:
 *      - "application/json"
 *     parameters:
 *      - in: path
 *        name: "collaboratorId"
 *        description: "collaboratorId"
 *        type: "string"
 *      - in: "formData"
 *        name: "paperProofFront"
 *        description: "File upload"
 *        required: false
 *        allowMultiple: true
 *        type: "file"
 *      - in: "formData"
 *        name: "paperProofBack"
 *        description: "File upload"
 *        required: false
 *        allowMultiple: true
 *        type: "file"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.post('/:collaboratorId/upload_paper_proof',
  withoutSavingUploader.any(), CollaboratorsController.uploadPaperProof);

// /**
//  * @openapi
//  * /a/collaborators/{collaboratorId}:
//  *   patch:
//  *     tags:
//  *      - "[ADMIN] Collaborators"
//  *     summary: Cập nhật TK CTV/ĐL/NPP
//  *     parameters:
//  *      - in: path
//  *        name: "collaboratorId"
//  *        description: "collaboratorId"
//  *        type: "string"
//  *      - in: "body"
//  *        name: "body"
//  *        description: "thông tin CTV"
//  *        schema:
//  *          type: "object"
//  *          properties:
//  *            fullName:
//  *              type: "string"
//  *            parentId:
//  *              type: "number"
//  *            dateOfBirth:
//  *              type: "string"
//  *              description: "YYYY-DD-MM"
//  *            phoneNumber:
//  *              type: "string"
//  *            username:
//  *              type: "string"
//  *            password:
//  *              type: "string"
//  *            email:
//  *              type: "string"
//  *            provinceId:
//  *              type: number
//  *            districtId:
//  *              type: number
//  *            wardId:
//  *              type: number
//  *            address:
//  *              type: "string"
//  *            defaultRank:
//  *              type: number
//  *            type:
//  *              type: "string"
//  *              enum:
//  *                 - collaborator
//  *                 - agency
//  *                 - distributor
//  *            collaboratorWorkingDays:
//  *              type: "array"
//  *              items:
//  *                type: "object"
//  *                properties:
//  *                  id:
//  *                    type: number
//  *                  workingDay:
//  *                    type: "string"
//  *                    enum:
//  *                      - monday
//  *                      - tuesday
//  *                      - wednesday
//  *                      - thursday
//  *                      - friday
//  *                      - saturday
//  *                      - sunday
//  *            openTime:
//  *              type: "string"
//  *              description: "hhmmss"
//  *            closeTime:
//  *              type: "string"
//  *              description: "hhmmss"
//  *            collaboratorMedia:
//  *              type: "array"
//  *              items:
//  *                type: "object"
//  *                properties:
//  *                  id:
//  *                    type: number
//  *                  type:
//  *                    type: "string"
//  *                    enum:
//  *                      - inside
//  *                      - outside
//  *     responses:
//  *       200:
//  *         description: Return data.
//  *       500:
//  *         description: Lỗi không xác định
//  *     security:
//  *      - Bearer: []
//  */
// router.patch('/:collaboratorId', CollaboratorsController.update);

/**
 * @openapi
 * /a/collaborators/{collaboratorId}/active:
 *   patch:
 *     tags:
 *      - "[ADMIN] Collaborators"
 *     summary: Mở khóa TK CTV/DL/NPP
 *     parameters:
 *      - in: path
 *        name: "collaboratorId"
 *        description: "collaboratorId"
 *        type: "string"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/:collaboratorId/active', CollaboratorsController.active);

/**
 * @openapi
 * /a/collaborators/{collaboratorId}/inactive:
 *   patch:
 *     tags:
 *      - "[ADMIN] Collaborators"
 *     summary: Khóa TK CTV/DL/NPP
 *     parameters:
 *      - in: path
 *        name: "collaboratorId"
 *        description: "collaboratorId"
 *        type: "string"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/:collaboratorId/inactive', CollaboratorsController.inactive);

/**
 * @openapi
 * /a/collaborators/{collaboratorId}:
 *   get:
 *     tags:
 *      - "[ADMIN] Collaborators"
 *     summary: Lấy thông tin CTV/DL/NPP
 *     parameters:
 *      - in: path
 *        name: "collaboratorId"
 *        description: "collaboratorId"
 *        type: number
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/:collaboratorId', CollaboratorsController.show);

/**
 * @openapi
 * /a/collaborators/{collaboratorId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] Collaborators"
 *     summary: Xóa TK CTV/DL/NPP
 *     parameters:
 *      - in: path
 *        name: "collaboratorId"
 *        description: "collaboratorId"
 *        type: "string"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.delete('/:collaboratorId', CollaboratorsController.delete);

/**
 * @openapi
 * /a/collaborators/{collaboratorId}/verify:
 *   patch:
 *     tags:
 *      - "[ADMIN] Collaborators"
 *     summary: Duyệt đơn ĐK TK CTV/ĐL/NPP
 *     parameters:
 *      - in: path
 *        name: "collaboratorId"
 *        description: "collaboratorId"
 *        type: number
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin CTV"
 *        schema:
 *          type: "object"
 *          properties:
 *            parentId:
 *              type: "number"
 *            username:
 *              type: "string"
 *            password:
 *              type: "string"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/:collaboratorId/verify', CollaboratorsController.verify);

/**
  * @openapi
  * /a/collaborators/{collaboratorId}/reject:
  *   patch:
  *     tags:
  *      - "[ADMIN] Collaborators"
  *     summary: Từ chối đơn ĐK TK CTV/ĐL/NPP
  *     parameters:
  *      - in: path
  *        name: "collaboratorId"
  *        description: "collaboratorId"
  *        type: number
  *      - in: "body"
  *        name: "body"
  *        description: "thông tin CTV"
  *        schema:
  *          type: "object"
  *          properties:
  *            rejectionReason:
  *              type: "string"
  *     responses:
  *       200:
  *         description: Return data.
  *       500:
  *         description: Lỗi không xác định
  *     security:
  *      - Bearer: []
  */
router.patch('/:collaboratorId/reject', CollaboratorsController.reject);

/**
 * @openapi
 * /a/collaborators/{collaboratorId}/upload_medias:
 *   post:
 *     tags:
 *      - "[ADMIN] Collaborators"
 *     summary: Upload media
 *     consumes:
 *      - "multipart/form-data"
 *     produces:
 *      - "application/json"
 *     parameters:
 *      - in: "path"
 *        name: "productId"
 *        type: "integer"
 *      - in: "formData"
 *        name: "Đặt tên biến theo id của collaborator media"
 *        description: "File upload"
 *        required: false
 *        allowMultiple: false
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
router.post('/:collaboratorId/upload_medias', withoutSavingUploader.any(), CollaboratorsController.uploadMedia);

export default router;
