import { Router } from 'express';
import PopupController from '@controllers/api/user/PopupsController';

const router = Router();

/**
 * @openapi
 * /u/popups:
 *   get:
 *     tags:
 *      - "[USER] POPUPS"
 *     summary: danh sach popup
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/', PopupController.index);

/**
 * @openapi
 * /u/popups/{popupId}:
 *   get:
 *     tags:
 *      - "[USER] POPUPS"
 *     summary: xem chi tiet mot popup
 *     parameters:
 *      - in: "path"
 *        name: "popupId"
 *        required: true
 *        type: "number"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/:popupId', PopupController.show);

export default router;
