import SellerController from '@controllers/api/seller/SellersController';
import { withoutSavingUploader } from '@middlewares/uploaders';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /s/sellers/upload_paper_proof:
 *   post:
 *     tags:
 *      - "[SELLER] SELLERS"
 *     summary: Tải lên ảnh CCCD
 *     consumes:
 *      - "multipart/form-data"
 *     produces:
 *      - "application/json"
 *     parameters:
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
router.post('/upload_paper_proof',
  withoutSavingUploader.fields([{ name: 'paperProofFront', maxCount: 1 }, { name: 'paperProofBack', maxCount: 1 }]), SellerController.uploadPaperProof);

/**
 * @openapi
 * /s/sellers:
 *   patch:
 *     tags:
 *      - "[SELLER] SELLERS"
 *     summary: Cập nhật TK CTV/ĐL/NPP
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
 *            collaboratorWorkingDays:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  id:
 *                    type: number
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
 *              default: '080000'
 *            closeTime:
 *              type: "string"
 *              description: "hhmmss"
 *              default: "173000"
 *            collaboratorMedia:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  id:
 *                    type: number
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
router.patch('/', SellerController.update);

/**
 * @openapi
 * /s/sellers/upload_medias:
 *   post:
 *     tags:
 *      - "[SELLER] SELLERS"
 *     summary: Upload media
 *     consumes:
 *      - "multipart/form-data"
 *     produces:
 *      - "application/json"
 *     parameters:
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
router.post('/upload_medias', withoutSavingUploader.any(), SellerController.uploadMedia);

/**
  * @openapi
  * /s/sellers/upload_avatar:
  *   patch:
  *     tags:
  *      - "[SELLER] SELLERS"
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
  *     responses:
  *       200:
  *         description: "Upload success"
  *       500:
  *         description: "Upload failed"
  *     security:
  *      - Bearer: []
  */
router.patch('/upload_avatar',
  withoutSavingUploader.single('avatar'), SellerController.uploadAvatar);

export default router;
