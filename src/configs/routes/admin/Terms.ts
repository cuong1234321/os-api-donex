import TermsController from '@controllers/api/admin/TermsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/terms/{type}:
 *   get:
 *     tags:
 *      - "[ADMIN] TERMS"
 *     summary: Tạo mới hướng dẫn săn điểm thưởng
 *     parameters:
 *      - in: path
 *        name: "type"
 *        description: "loai"
 *        enum:
 *         - ruleUsingBonusPoint
 *         - guideHuntingBonusPoint
 *         - introduce
 *         - guideBuy
 *         - guideChooseSize
 *         - policy
 *         - chanceJob
 *         - transport
 *     responses:
 *       200:
 *         description: Return data.
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Error can't get data.
 *     security:
 *      - Bearer: []
 */
router.get('/:type', TermsController.show);

/**
 * @openapi
 * /a/terms/{type}:
 *   post:
 *     tags:
 *      - "[ADMIN] TERMS"
 *     summary: Tạo mới hướng dẫn săn điểm thưởng
 *     parameters:
 *      - in: path
 *        name: "type"
 *        description: "loai"
 *        enum:
 *         - ruleUsingBonusPoint
 *         - guideHuntingBonusPoint
 *         - introduce
 *         - guideBuy
 *         - guideChooseSize
 *         - policy
 *         - chanceJob
 *         - transport
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin terms"
 *        schema:
 *          type: "object"
 *          properties:
 *            content:
 *              type: "string"
 *              description: "Nội dung"
 *              default: "Name example"
 *     responses:
 *       200:
 *         description: Return data.
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Error can't get data.
 *     security:
 *      - Bearer: []
 */
router.post('/:type', TermsController.update);

export default router;
