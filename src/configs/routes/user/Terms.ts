import TermsController from '@controllers/api/user/TermsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/terms/{type}:
 *   get:
 *     tags:
 *      - "[USER] TERMS"
 *     summary: Danh sách
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
router.get('/:type', TermsController.index);

export default router;
