import SellerBanksController from '@controllers/api/seller/SellerBanksController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /s/seller_banks/:
 *   get:
 *     tags:
 *      - "[SELLER] SELLER BANKS"
 *     summary: Danh sách tài khoản ngân hàng
 *     responses:
 *       200:
 *         description: "Success"
 *       500:
 *        description: Internal error
 *     security:
 *      - Bearer: []
 */
router.get('/', SellerBanksController.index);

/**
 * @openapi
 * /s/seller_banks/{sellerBankId}:
 *   get:
 *     tags:
 *      - "[SELLER] SELLER BANKS"
 *     summary: Xem chi tiết
 *     parameters:
 *      - in: "path"
 *        name: "sellerBankId"
 *        required: true
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/:sellerBankId', SellerBanksController.show);

/**
 * @openapi
 * /s/seller_banks:
 *   post:
 *     tags:
 *      - "[SELLER] SELLER BANKS"
 *     summary: Thêm mới tài khoản
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin voucher"
 *        schema:
 *          type: "object"
 *          properties:
 *            bankId:
 *              type: "integer"
 *              description: "ID ngân hàng"
 *            branch:
 *              type: "string"
 *              description: "Chi nhánh"
 *            ownerName:
 *              type: "string"
 *              description: "Chủ tài khoản"
 *            accountNumber:
 *              type: "string"
 *              description: "Số tài khoản"
 *            isDefaultAccount:
 *              type: "boolean"
 *              description: "tài khoản mặc định?"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.post('/', SellerBanksController.create);

/**
 * @openapi
 * /s/seller_banks/{sellerBankId}:
 *   patch:
 *     tags:
 *      - "[SELLER] SELLER BANKS"
 *     summary: Chỉnh sửa thông tin tài khoản
 *     parameters:
 *      - in: "path"
 *        name: "sellerBankId"
 *        required: true
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin voucher"
 *        schema:
 *          type: "object"
 *          properties:
 *            bankId:
 *              type: "integer"
 *              description: "ID ngân hàng"
 *            branch:
 *              type: "string"
 *              description: "Chi nhánh"
 *            ownerName:
 *              type: "string"
 *              description: "Chủ tài khoản"
 *            accountNumber:
 *              type: "string"
 *              description: "Số tài khoản"
 *            isDefaultAccount:
 *              type: "boolean"
 *              description: "tài khoản mặc định?"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.patch('/:sellerBankId', SellerBanksController.update);

/**
 * @openapi
 * /s/seller_banks/{sellerBankId}:
 *   delete:
 *     tags:
 *      - "[SELLER] SELLER BANKS"
 *     summary: Xóa tài khoản
 *     parameters:
 *      - in: "path"
 *        name: "sellerBankId"
 *        required: true
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.delete('/:sellerBankId', SellerBanksController.delete);

export default router;
