import VoucherController from '@controllers/api/user/VouchersControllers';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/user_vouchers:
 *   get:
 *     tags:
 *      - "[USER] USER VOUCHERS"
 *     summary: Danh sách vouchers
 *     parameters:
 *       - in: "query"
 *         name: "page"
 *         description: "xem trang bao nhiêu"
 *         type: "number"
 *       - in: "query"
 *         name: "status"
 *         description: ""
 *         type: "string"
 *         enum:
 *          - used
 *          - outOfDate
 *          - active
 *       - in: "query"
 *         name: "freeWord"
 *         description: "tìm kiếm theo tên chương trình"
 *         type: "string"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.get('/', VoucherController.index);

export default router;
