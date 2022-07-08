import { Router } from 'express';
import IncomeReportController from '@controllers/api/admin/IncomeReportsController';
import authorization from '@middlewares/authorization';

const router = Router();

/**
 * @openapi
 * /a/incomes/sellers:
 *   get:
 *     tags:
 *      - "[ADMIN] INCOME REPORTS"
 *     summary: doanh thu theo CTV/DL/NPP
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "number"
 *      - in: query
 *        name: "size"
 *        description: "size"
 *        type: "number"
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
router.get('/sellers', authorization.permit(IncomeReportController.constructor.name, 'index'), IncomeReportController.sellerIncome);

/**
 * @openapi
 * /a/incomes/employees:
 *   get:
 *     tags:
 *      - "[ADMIN] INCOME REPORTS"
 *     summary: doanh thu theo nhan vien
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "number"
 *      - in: query
 *        name: "size"
 *        description: "size"
 *        type: "number"
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
 *        name: quantityFrom
 *        description: "số đơn từ"
 *        type: number
 *      - in: query
 *        name: quantityTo
 *        description: "số đơn đến"
 *        type: number
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
router.get('/employees', authorization.permit(IncomeReportController.constructor.name, 'index'), IncomeReportController.employeeIncome);

/**
  * @openapi
  * /a/incomes/warehouses:
  *   get:
  *     tags:
  *      - "[ADMIN] INCOME REPORTS"
  *     summary: doanh thu theo kho
  *     parameters:
  *      - in: query
  *        name: "page"
  *        description: "page"
  *        type: "number"
  *      - in: query
  *        name: "size"
  *        description: "size"
  *        type: "number"
  *      - in: query
  *        name: fromDate
  *        description: "YYYY/MM/DD"
  *      - in: query
  *        name: toDate
  *        description: "YYYY/MM/DD"
  *      - in: query
  *        name: quantityFrom
  *        description: "số đơn từ"
  *        type: number
  *      - in: query
  *        name: quantityTo
  *        description: "số đơn đến"
  *        type: number
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
router.get('/warehouses', authorization.permit(IncomeReportController.constructor.name, 'index'), IncomeReportController.warehouseIncome);

/**
 * @openapi
 * /a/incomes/employees/download:
 *   get:
 *     tags:
 *      - "[ADMIN] INCOME REPORTS"
 *     summary: tai xuong doanh thu theo nhan vien
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
 *        name: quantityFrom
 *        description: "số đơn từ"
 *        type: number
 *      - in: query
 *        name: quantityTo
 *        description: "số đơn đến"
 *        type: number
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
router.get('/employees/download', authorization.permit(IncomeReportController.constructor.name, 'index'), IncomeReportController.downloadEmployeeIncome);

/**
 * @openapi
 * /a/incomes/sellers/download:
 *   get:
 *     tags:
 *      - "[ADMIN] INCOME REPORTS"
 *     summary: tai xuong doanh thu theo CTV/DL/NPP
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
router.get('/sellers/download', authorization.permit(IncomeReportController.constructor.name, 'index'), IncomeReportController.downloadSellerIncome);

/**
  * @openapi
  * /a/incomes/warehouses/download:
  *   get:
  *     tags:
  *      - "[ADMIN] INCOME REPORTS"
  *     summary: doanh thu theo kho
  *     parameters:
  *      - in: query
  *        name: fromDate
  *        description: "YYYY/MM/DD"
  *      - in: query
  *        name: toDate
  *        description: "YYYY/MM/DD"
  *      - in: query
  *        name: quantityFrom
  *        description: "số đơn từ"
  *        type: number
  *      - in: query
  *        name: quantityTo
  *        description: "số đơn đến"
  *        type: number
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
router.get('/warehouses/download', authorization.permit(IncomeReportController.constructor.name, 'index'), IncomeReportController.downloadWarehouseIncome);

export default router;
