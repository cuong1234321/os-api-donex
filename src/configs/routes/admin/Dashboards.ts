import { Router } from 'express';
import DashboardController from '@controllers/api/admin/DashboardsController';

const router = Router();

/**
 * @openapi
 * /a/dashboard:
 *   get:
 *     tags:
 *      - "[ADMIN] DASHBOARD"
 *     summary: nguoi dung
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/', DashboardController.userIndex);

/**
 * @openapi
 * /a/dashboard/income:
 *   get:
 *     tags:
 *      - "[ADMIN] DASHBOARD"
 *     summary: doanh thu
 *     parameters:
 *      - in: query
 *        name: orderableType
 *        enum:
 *         - user
 *         - seller
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/income/', DashboardController.income);

/**
 * @openapi
 * /a/dashboard/statistical:
 *   get:
 *     tags:
 *      - "[ADMIN] DASHBOARD"
 *     summary: thong ke
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/statistical/', DashboardController.statistical);

export default router;
