import { Router } from 'express';
import BankAccountsController from '@controllers/api/admin/BankAccountsController';

const router = Router();

/**
 * @openapi
 * /u/bank_accounts/:
 *   get:
 *     tags:
 *      - "[USER] BANK ACCOUNT"
 *     summary: List danh sách tài khoản ngân hàng
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "string"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.get('/', BankAccountsController.index);

export default router;
