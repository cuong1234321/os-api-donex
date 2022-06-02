import { Router } from 'express';
import { withoutSavingUploader } from '@middlewares/uploaders';
import BankAccountsController from '@controllers/api/admin/BankAccountsController';
import Authorization from '@middlewares/authorization';

const router = Router();

/**
 * @openapi
 * /a/bank_accounts/:
 *   get:
 *     tags:
 *      - "[ADMIN] BANK ACCOUNT"
 *     summary: List danh sách tài khoản ngân hàng
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
 *        name: "bankId"
 *        description: "ngân hàng"
 *        type: "string"
 *      - in: query
 *        name: "freeWord"
 *        description: "Tìm kiếm theo tên người sở hữu"
 *        type: "string"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.get('/', Authorization.permit(BankAccountsController.constructor.name, 'index'), BankAccountsController.index);

/**
 * @openapi
 * /a/bank_accounts/:
 *   post:
 *     tags:
 *      - "[ADMIN] BANK ACCOUNT"
 *     summary: tạo tài khoản
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin"
 *        schema:
 *          type: "object"
 *          properties:
 *            bankId:
 *              type: "number"
 *              description: "id ngan hang"
 *            bankAccount:
 *              type: "number"
 *              description: "so tk ngan hang"
 *            bankOwner:
 *              type: "string"
 *              description: "Tên chủ sở hữu"
 *            status:
 *              type: "string"
 *              description: "Trạng thái"
 *              enum:
 *                - active
 *                - inactive
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.post('/', Authorization.permit(BankAccountsController.constructor.name, 'create'), BankAccountsController.create);

/**
 * @openapi
 * /a/bank_accounts/{bankAccountId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] BANK ACCOUNT"
 *     summary: cập nhật tài khoản
 *     parameters:
 *      - in: path
 *        name: bankAccountId
 *        type: string
 *        description: id phương thức thanh toán
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin"
 *        schema:
 *          type: "object"
 *          properties:
 *            bankId:
 *              type: "number"
 *              description: "id ngan hang"
 *            bankAccount:
 *              type: "number"
 *              description: "so tk ngan hang"
 *            bankOwner:
 *              type: "string"
 *              description: "Tên chủ sở hữu"
 *            status:
 *              type: "string"
 *              description: "Trạng thái"
 *              enum:
 *                - active
 *                - inactive
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.patch('/:bankAccountId', Authorization.permit(BankAccountsController.constructor.name, 'update'), BankAccountsController.update);

/**
 * @openapi
 * /a/bank_accounts/{bankAccountId}:
 *   get:
 *     tags:
 *      - "[ADMIN] BANK ACCOUNT"
 *     summary: thông tin tài khoản ngân hàng
 *     parameters:
 *      - in: path
 *        name: bankAccountId
 *        type: string
 *        description: id phương thức thanh toán
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.get('/:bankAccountId', Authorization.permit(BankAccountsController.constructor.name, 'show'), BankAccountsController.show);

/**
 * @openapi
 * /a/bank_accounts/{bankAccountId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] BANK ACCOUNT"
 *     summary: Xóa tài khoản ngân hàng
 *     parameters:
 *      - in: path
 *        name: bankAccountId
 *        type: string
 *        description: id phương thức thanh toán
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.delete('/:bankAccountId', Authorization.permit(BankAccountsController.constructor.name, 'delete'), BankAccountsController.delete);

/**
 * @openapi
 * /a/bank_accounts/{bankAccountId}/upload_qr_ode:
 *   patch:
 *     tags:
 *      - "[ADMIN] BANK ACCOUNT"
 *     summary: Tải lên mã QR code
 *     consumes:
 *      - "multipart/form-data"
 *     produces:
 *      - "application/json"
 *     parameters:
 *      - in: "formData"
 *        name: "qrCode"
 *        description: "File upload"
 *        required: false
 *        allowMultiple: true
 *        type: "file"
 *      - in: "path"
 *        name: "bankAccountId"
 *        required: true
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.patch('/:bankAccountId/upload_qr_ode',
  Authorization.permit(BankAccountsController.constructor.name, 'uploadQRCode'),
  withoutSavingUploader.single('qrCode'), BankAccountsController.uploadImageQRCode);

export default router;
