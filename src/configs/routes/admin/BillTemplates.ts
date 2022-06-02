import BillTemplateController from '@controllers/api/admin/BillTemplatesController';
import { Router } from 'express';
import Authorization from '@middlewares/authorization';

const router = Router();

/**
 * @openapi
 * /a/bill_templates:
 *   get:
 *     tags:
 *      - "[ADMIN] BILL TEMPLATES"
 *     summary: chi tiet mau hoa don
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/', Authorization.permit(BillTemplateController.constructor.name, 'show'), BillTemplateController.show);

/**
 * @openapi
 * /a/bill_templates:
 *   post:
 *     tags:
 *      - "[ADMIN] BILL TEMPLATES"
 *     summary: cap nhat mau hoa don
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "cap nhat mau hoa don"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *            content:
 *              type: "string"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.post('/', Authorization.permit(BillTemplateController.constructor.name, 'create'), BillTemplateController.create);

export default router;
