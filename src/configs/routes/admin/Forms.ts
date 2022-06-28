import FormController from '@controllers/api/admin/FormsController';
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
router.get('/', FormController.index);

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
router.get('/:formId', FormController.show);

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

router.post('/', FormController.create);

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
router.patch('/:formId', FormController.update);

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
router.delete('/:formId', FormController.delete);

export default router;
