import MSizeController from '@controllers/api/admin/MSizeController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/sizes/download:
 *   get:
 *     tags:
 *      - "[ADMIN] MSIZES"
 *     summary: Tải xuống danh sách size
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/download', MSizeController.download);

export default router;
