import RanksController from '@controllers/api/user/RanksController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/ranks/:
 *   get:
 *     tags:
 *      - "[USER] RANKS"
 *     summary: Xem chi tiết
 *     parameters:
 *      - in: "query"
 *        name: "type"
 *        type: "string"
 *        description: "Loai rank"
 *        enum:
 *         - basic
 *         - vip
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/', RanksController.index);

export default router;
