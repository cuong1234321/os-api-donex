import MoneyWalletChangesController from '@controllers/api/admin/MoneyWalletChangesController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/money_wallet_changes/{sellerId}/:
 *   get:
 *     tags:
 *      - "[ADMIN] MONEY WALLET CHANGE"
 *     summary:  Lấy danh sách lịch ví
 *     parameters:
 *      - in: path
 *        name: "sellerId"
 *        description: "sellerId"
 *        type: "string"
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "string"
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "string"
 *      - in: query
 *        name: "createdAtFrom"
 *        description: "từ ngày"
 *        type: "string"
 *      - in: query
 *        name: "createdAtTo"
 *        description: "đến ngày"
 *        type: "string"
 *      - in: query
 *        name: "sortOrder"
 *        description: "Thứ tự sắp xếp"
 *        type: "string"
 *        enum:
 *          - ASC
 *          - DESC
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/:sellerId/', MoneyWalletChangesController.index);

export default router;
