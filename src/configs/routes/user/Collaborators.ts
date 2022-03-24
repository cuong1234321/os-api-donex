import { Router } from 'express';
import CollaboratorController from '@controllers/api/user/CollaboratorsController';
import { withoutSavingUploader } from '@middlewares/uploaders';

const router = Router();

/**
 * @openapi
 * /u/collaborators/:
 *   post:
 *     tags:
 *      - "[USER] Collaborators"
 *     summary: Dang ky CTV/ĐL/NPP
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin CTV"
 *        schema:
 *          type: "object"
 *          properties:
 *            fullName:
 *              type: "string"
 *            dateOfBirth:
 *              type: "string"
 *              description: "YYYY-DD-MM"
 *            phoneNumber:
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
 *            collaborator:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  type:
 *                    type: "string"
 *                    description: "loai"
 *                    enum:
 *                    - collaborator
 *                    - agency
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.post('/', CollaboratorController.register);

/**
 * @openapi
 * /u/collaborators/{collaboratorId}/upload_paper_proof:
 *   patch:
 *     tags:
 *      - "[USER] Collaborators"
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
router.patch('/:collaboratorId/upload_paper_proof',
  withoutSavingUploader.any(), CollaboratorController.uploadPaperProof);

/**
 * @openapi
 * /u/collaborators:
 *   get:
 *     tags:
 *      - "[USER] Collaborators"
 *     summary: danh sach cua hang
 *     parameters:
 *      - in: "query"
 *        name: "type"
 *        enum:
 *         - distributor
 *         - agency
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/', CollaboratorController.index);

/**
  * @openapi
  * /u/collaborators/{collaboratorId}:
  *   get:
  *     tags:
  *      - "[USER] Collaborators"
  *     summary: chi tiet cua hang
  *     parameters:
  *      - in: "path"
  *        name: "collaboratorId"
  *     responses:
  *       200:
  *         description: Return data.
  *       500:
  *         description: Lỗi không xác định
  *     security:
  *      - Bearer: []
  */
router.get('/:collaboratorId', CollaboratorController.show);

export default router;
