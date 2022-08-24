import MColorController from '@controllers/api/admin/MColorController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/colors/download:
 *   get:
 *     tags:
 *      - "[ADMIN] MCOLORS"
 *     summary: Tải xuống danh sách màu sắc
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/download', MColorController.download);

export default router;
