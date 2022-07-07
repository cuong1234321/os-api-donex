import FormController from '@controllers/api/admin/FormsController';
import authorization from '@middlewares/authorization';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/forms:
 *   get:
 *     tags:
 *      - "[ADMIN] FORMS"
 *     summary: Lấy danh sách form
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/', authorization.permit(FormController.constructor.name, 'index'), FormController.index);

/**
 * @openapi
 * /a/forms/{formId}:
 *   get:
 *     tags:
 *      - "[ADMIN] FORMS"
 *     summary: xem chi tiet form
 *     parameters:
 *      - in: "path"
 *        name: "formId"
 *        description: "form id"
 *        required: true
 *        type: "number"
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
router.get('/:formId', authorization.permit(FormController.constructor.name, 'show'), FormController.show);

/**
 * @openapi
 * /a/forms:
 *   post:
 *     tags:
 *      - "[ADMIN] FORMS"
 *     summary: Tạo mới form
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin form"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *              description: "Tên form"
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

router.post('/', authorization.permit(FormController.constructor.name, 'create'), FormController.create);

/**
 * @openapi
 * /a/forms/{formId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] FORMS"
 *     summary: Sửa form
 *     parameters:
 *      - in: "path"
 *        name: "formId"
 *        description: "form id"
 *        required: true
 *        type: "number"
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin category"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *              description: "Tên form"
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
router.patch('/:formId', authorization.permit(FormController.constructor.name, 'update'), FormController.update);

/**
 * @openapi
 * /a/forms/{formId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] FORMS"
 *     summary: xóa form
 *     parameters:
 *      - in: "path"
 *        name: "formId"
 *        description: "form id"
 *        required: true
 *        type: "number"
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
router.delete('/:formId', authorization.permit(FormController.constructor.name, 'delete'), FormController.delete);

export default router;
