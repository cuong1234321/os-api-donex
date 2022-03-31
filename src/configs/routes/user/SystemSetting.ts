import SystemSettingsController from '@controllers/api/user/SystemSettingsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/system_setting/:
 *   get:
 *     tags:
 *      - "[USER] SYSTEM SETTING"
 *     summary: Cài đặt hệ thống
 *     description: "{
 *          id: undefined,
 *          applicationLink: '',
 *          coinConversionLevel: 0
 *      }"
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal error
 *     security:
 *      - Bearer: []
 */

router.get('/', SystemSettingsController.show);

export default router;
