import ReportsController from '@controllers/api/admin/ReportsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/report/variants:
 *   get:
 *     tags:
 *      - "[ADMIN] REPORTS"
 *     summary: Bao cao
 *     description: Bao cao
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "string"
 *      - in: query
 *        name: "freeWord"
 *        description: "Tìm kiếm theo tên"
 *        type: "string"
 *      - in: query
 *        name: "fromDate"
 *        description: "Từ ngày"
 *        type: "date"
 *      - in: query
 *        name: "toDate"
 *        description: "Tới ngày"
 *        type: "date"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/variants', ReportsController.reportVariants);

/**
 * @openapi
 * /a/report/users:
 *   get:
 *     tags:
 *      - "[ADMIN] REPORTS"
 *     summary: Bao cao
 *     description: Bao cao
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "string"
 *      - in: query
 *        name: "freeWord"
 *        description: "Tìm kiếm theo tên"
 *        type: "string"
 *      - in: query
 *        name: "fromDate"
 *        description: "Từ ngày"
 *        type: "date"
 *      - in: query
 *        name: "toDate"
 *        description: "Tới ngày"
 *        type: "date"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/users', ReportsController.reportUsers);

/**
 * @openapi
 * /a/report/variant_sale:
 *   get:
 *     tags:
 *      - "[ADMIN] REPORTS"
 *     summary: Bao cao
 *     description: Bao cao
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "string"
 *      - in: query
 *        name: "freeWord"
 *        description: "Tìm kiếm theo tên"
 *        type: "string"
 *      - in: query
 *        name: "fromDate"
 *        description: "Từ ngày"
 *        type: "date"
 *      - in: query
 *        name: "toDate"
 *        description: "Tới ngày"
 *        type: "date"
 *      - in: query
 *        name: "categoryId"
 *        description: "id danh muc"
 *        type: "number"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/variant_sale', ReportsController.reportVariantSale);

/**
 * @openapi
 * /a/report/used_coin:
 *   get:
 *     tags:
 *      - "[ADMIN] REPORTS"
 *     summary: Bao cao
 *     description: Bao cao
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "string"
 *      - in: query
 *        name: "freeWord"
 *        description: "Tìm kiếm theo tên"
 *        type: "string"
 *      - in: query
 *        name: "fromDate"
 *        description: "Từ ngày"
 *        type: "date"
 *      - in: query
 *        name: "toDate"
 *        description: "Tới ngày"
 *        type: "date"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/used_coin', ReportsController.reportUsedCoinReward);

export default router;
