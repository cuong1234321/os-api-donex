import { Router } from 'express';
import BankController from '@controllers/api/admin/BanksController';

const router = Router();

/**
 * @openapi
 * /a/banks/:
 *   get:
 *     tags:
 *      - "[ADMIN] BANKS"
 *     summary: List danh sách bank
 *     parameters:
 *      - in: query
 *        name: keyword
 *        schema:
 *          type: string
 *        description: Từ khóa tìm kiếm ngân hàng, mặc định sẽ trả về toàn bộ
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.get('/', BankController.index);

export default router;
