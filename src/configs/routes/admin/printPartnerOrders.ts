import PrintPartnerOrdersController from '@controllers/api/admin/PrintPartnerOrdersController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/print_partner_orders:
 *   get:
 *     tags:
 *      - "[ADMIN] PRINT PARTNER ORDER"
 *     summary: Xuất báo cáo hóa đơn
 *     parameters:
 *      - in: "query"
 *        name: "subOrderIds"
 *        description: "Thông tin"
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/', PrintPartnerOrdersController.show);

export default router;
