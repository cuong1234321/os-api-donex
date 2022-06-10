import TermsController from '@controllers/api/admin/TermsController';
import { Router } from 'express';
import Authorization from '@middlewares/authorization';

const router = Router();

/**
 * @openapi
 * /a/terms/{type}:
 *   get:
 *     tags:
 *      - "[ADMIN] TERMS"
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
router.get('/:type', Authorization.permit(TermsController.constructor.name, 'index'), TermsController.index);

/**
 * @openapi
 * /a/terms/{type}/update/{termId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] TERMS"
 *     summary: Cập nhật
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
 *      - in: path
 *        name: "termId"
 *        description: "id term"
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
router.patch('/:type/update/:termId', Authorization.permit(TermsController.constructor.name, 'update'), TermsController.update);

/**
 * @openapi
 * /a/terms/{type}/delete/{termId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] TERMS"
 *     summary: Xóa
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
 *      - in: path
 *        name: "termId"
 *        description: "id term"
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
router.delete('/:type/delete/:termId', Authorization.permit(TermsController.constructor.name, 'delete'), TermsController.delete);

/**
 * @openapi
 * /a/terms/{type}/:
 *   post:
 *     tags:
 *      - "[ADMIN] TERMS"
 *     summary: Tạo mới
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
router.post('/:type/', Authorization.permit(TermsController.constructor.name, 'create'), TermsController.create);

export default router;
