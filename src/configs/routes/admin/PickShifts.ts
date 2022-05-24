import pickShiftsController from '@controllers/api/admin/pickShiftsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/pick_shifts:
 *   get:
 *     tags:
 *      - "[ADMIN] PICK SHIFT"
 *     summary: Thời gian ship hàng
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/', pickShiftsController.index);

export default router;
