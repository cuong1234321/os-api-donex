import SystemSettingsController from '@controllers/api/admin/SystemSettingsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/system_setting/:
 *   get:
 *     tags:
 *      - "[ADMIN] SYSTEM SETTING"
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

/**
 * @openapi
 * /a/system_setting/:
 *   patch:
 *     tags:
 *      - "[ADMIN] SYSTEM SETTING"
 *     summary: cập nhật Cài đặt hệ thống
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin theo ngày"
 *        schema:
 *          type: "object"
 *          properties:
 *            applicationLink:
 *              type: "string"
 *              description: "link app"
 *            coinConversionLevel:
 *              type: "integer"
 *              description: "mức chuyển đổi"
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal error
 *     security:
 *      - Bearer: []
 */

router.patch('/', SystemSettingsController.update);

export default router;
