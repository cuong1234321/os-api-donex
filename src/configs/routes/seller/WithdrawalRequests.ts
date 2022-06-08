import WithdrawalRequestController from '@controllers/api/seller/WithdrawalRequestsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /s/withdrawal_requests:
 *   get:
 *     tags:
 *      - "[SELLER] WITHDRAWAL REQUESTS"
 *     summary: Danh sách yêu cầu rút tiền
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
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.get('/', WithdrawalRequestController.index);

/**
 * @openapi
 * /s/withdrawal_requests:
 *   post:
 *     tags:
 *      - "[SELLER] WITHDRAWAL REQUESTS"
 *     summary: Yêu cầu rút tiền
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin voucher"
 *        schema:
 *          type: "object"
 *          properties:
 *            ownerBankId:
 *              type: "integer"
 *              description: "ID tài khoản ngân hàng"
 *            amount:
 *              type: "integer"
 *              description: "Số tiền"
 *            requestNote:
 *              type: "integer"
 *              description: "ghi chus"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.post('/', WithdrawalRequestController.create);

export default router;
