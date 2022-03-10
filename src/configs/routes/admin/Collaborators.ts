import CollaboratorsController from '@controllers/api/admin/CollaboratorsController';
import { withoutSavingUploader } from '@middlewares/uploaders';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/collaborators:
 *   get:
 *     tags:
 *      - "[ADMIN] Collaborators"
 *     summary: Lấy danh sách danh CTV/DL/NPP
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "string"
 *      - in: query
 *        name: "status"
 *        description: "status"
 *        type: "string"
 *      - in: query
 *        name: "gender"
 *        description: "Giới tính"
 *        type: "string"
 *      - in: query
 *        name: "freeWord"
 *        description: "Tìm kiếm theo id, tên, username, sdt"
 *        type: "string"
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/', CollaboratorsController.index);

/**
 * @openapi
 * /a/collaborators/create:
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
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.post('/create', CollaboratorsController.create);

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

export default router;
