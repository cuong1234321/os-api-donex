import TopUpDepositsController from '@controllers/api/seller/TopUpDepositsController';
import { sellerPassport } from '@middlewares/passport';
import { Router } from 'express';

const router = Router();
/**
 * @openapi
 * /s/top_up_deposits:
 *   post:
 *     tags:
 *      - "[SELLER] TOP UP DEPOSIT"
 *     summary: Tạo mới thanh toasn
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin terms"
 *        schema:
 *          type: "object"
 *          properties:
 *            type:
 *              type: "string"
 *              description: "Tiêu đè bài viết"
 *              default: 'vnPay'
 *              enum:
 *                - vnPay
 *                - banking
 *            amount:
 *              type: "number"
 *              description: "số tiền"
 *              default: 'null'
 *     responses:
 *       200:
 *         description: Return data.
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Error can't get data.
 *     security:
 *      - Bearer: []
 */
router.post('/', sellerPassport.authenticate('jwt', { session: false }), TopUpDepositsController.create);

/**
 * @openapi
 * /s/top_up_deposits/{topUpDepositId}/reattempt_payment:
 *   get:
 *     tags:
 *      - "[SELLER] TOP UP DEPOSIT"
 *     summary: API lấy ra 1 order theo id cần thanh toán lại
 *     parameters:
 *      - name: "topUpDepositId"
 *        in: "path"
 *        description: "topUpDepositId"
 *        required: true
 *        type: "number"
 *     responses:
 *       200:
 *         description: Return data.
 *       400:
 *         description: Error can't get data.
 *     security:
 *      - Bearer: []
 */
router.get('/:topUpDepositId/reattempt_payment', sellerPassport.authenticate('jwt', { session: false }), TopUpDepositsController.reattemptPayment);

export default router;
