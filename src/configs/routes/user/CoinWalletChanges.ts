import CoinWalletChangeController from '@controllers/api/user/CoinWalletChangesController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/coin_wallet_changes:
 *   get:
 *     tags:
 *      - "[USER] COIN WALLET CHANGES"
 *     summary: Lấy danh sách thay đổi
 *     parameters:
 *       - in: "query"
 *         name: "page"
 *         description: "xem trang bao nhiêu"
 *         type: "number"
 *       - in: query
 *         name: "createdAtFrom"
 *         type: "string"
 *       - in: query
 *         name: "createdAtTo"
 *         type: "string"
 *       - in: "query"
 *         name: "type"
 *         type: "string"
 *         description: "Loại"
 *         enum:
 *           - subtract
 *           - add
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.get('/', CoinWalletChangeController.index);

export default router;
