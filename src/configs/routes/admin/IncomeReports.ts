import { Router } from 'express';
import IncomeReportController from '@controllers/api/admin/IncomeReportsController';

const router = Router();

/**
 * @openapi
 * /a/incomes/employees:
 *   get:
 *     tags:
 *      - "[ADMIN] INCOME REPORTS"
 *     summary: doanh thu theo CTV/DL/NPP
 *     parameters:
 *      - in: query
 *        name: freeWord
 *        description: ma nhan vien, ten nhan vien, sdt
 *      - in: query
 *        name: fromDate
 *        description: "YYYY/MM/DD"
 *      - in: query
 *        name: toDate
 *        description: "YYYY/MM/DD"
 *      - in: query
 *        name: discountFrom
 *        description: "chiết khấu từ"
 *        type: number
 *      - in: query
 *        name: discountTo
 *        description: "chiết khấu đến"
 *        type: number
 *      - in: query
 *        name: incomeFrom
 *        description: "doanh thu từ"
 *        type: number
 *      - in: query
 *        name: incomeTo
 *        description: "doanh thu đến"
 *        type: number
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.get('/employees', IncomeReportController.sellerIncome);

export default router;
