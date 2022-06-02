import { Router } from 'express';
import WarehouseReportController from '@controllers/api/admin/WarehouseReportsController';
import Authorization from '@middlewares/authorization';

const router = Router();

/**
 * @openapi
 * /a/warehouse_reports:
 *   get:
 *     tags:
 *      - "[ADMIN] WAREHOUSE REPORT"
 *     summary: Bao cao ton kho
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "number"
 *      - in: query
 *        name: "page"
 *        description: "size"
 *        type: "number"
 *      - in: query
 *        name: "fromDate"
 *        description: "Ngay bat dau YYYY/MM/DD"
 *        type: "string"
 *      - in: query
 *        name: "toDate"
 *        description: "Ngay ket thuc YYYY/MM/DD"
 *        type: "string"
 *      - in: query
 *        name: "warehouseId"
 *        description: "id kho hang"
 *        type: "number"
 *      - in: query
 *        name: "productCategoryId"
 *        description: "Danh mục"
 *        type: "number"
 *      - in: query
 *        name: "freeWord"
 *        description: "Tìm kiếm theo tên, sku"
 *        type: "string"
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/', Authorization.permit(WarehouseReportController.constructor.name, 'index'), WarehouseReportController.index);

export default router;
