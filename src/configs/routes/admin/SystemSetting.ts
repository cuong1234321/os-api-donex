import SystemSettingsController from '@controllers/api/admin/SystemSettingsController';
import { Router } from 'express';
import Authorization from '@middlewares/authorization';

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

router.get('/', Authorization.permit(SystemSettingsController.constructor.name, 'show'), SystemSettingsController.show);

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
 *            coinConversionLevel:
 *              type: "integer"
 *              description: "mức chuyển đổi"
 *            coinFinishOrder:
 *              type: "number"
 *              description: "mức chuyển đổi từ tiền sang xu"
 *            hotline:
 *              type: "integer"
 *              description: "số hotline 24/7"
 *            hotlineUser:
 *              type: "integer"
 *              description: "hot line khách lẻ"
 *            hotlineAgency:
 *              type: "integer"
 *              description: "hotline nhà phan phối"
 *            facebookLink:
 *              type: "string"
 *              description: "facebookLink"
 *            instagramLink:
 *              type: "string"
 *              description: "instagramLink"
 *            twitterLink:
 *              type: "string"
 *              description: "twitterLink"
 *            shopeeLink:
 *              type: "string"
 *              description: "shopeeLink"
 *            lazadaLink:
 *              type: "string"
 *              description: "lazadaLink"
 *            tikiLink:
 *              type: "string"
 *              description: "tikiLink"
 *            amazonLink:
 *              type: "string"
 *              description: "amazonLink"
 *            androidAppLink:
 *              type: "string"
 *              description: "androidAppLink"
 *            iosAppLink:
 *              type: "string"
 *              description: "iosAppLink"
 *            tawktoScriptUrl:
 *              type: "string"
 *              description: "tawktoScriptUrl"
 *            seoSetting:
 *              type: "string"
 *              description: "SEO"
 *            robot:
 *              type: "string"
 *              description: "robot"
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal error
 *     security:
 *      - Bearer: []
 */

router.patch('/', Authorization.permit(SystemSettingsController.constructor.name, 'update'), SystemSettingsController.update);

export default router;
