import MoneyWalletChangesController from '@controllers/api/seller/MoneyWalletChangesController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /s/money_wallet_changes:
 *   get:
 *     tags:
 *      - "[SELLER] MONEY WALLET CHANGE"
 *     summary: Lấy danh sách lịch ví
 *     parameters:
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
router.get('/', MoneyWalletChangesController.index);

export default router;
