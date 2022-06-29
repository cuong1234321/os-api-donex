import { Router } from 'express';
import Authorization from '@middlewares/authorization';
import LookBookController from '@controllers/api/admin/LookBooksController';

const router = Router();

/**
 * @openapi
 * /a/look_books:
 *   get:
 *     tags:
 *      - "[ADMIN] LOOK BOOKS"
 *     summary: Lấy danh sách lookBook
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "string"
 *      - in: query
 *        name: "status"
 *        description: "status"
 *        type: "string"
 *      - in: query
 *        name: "freeWord"
 *        description: "Tìm kiếm theo tên"
 *        type: "string"
 *      - in: query
 *        name: "sortBy"
 *        description: "sắp xếp theo"
 *        type: "string"
 *      - in: query
 *        name: "sortOrder"
 *        description: "Loại sắp xếp"
 *        type: "string"
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/', Authorization.permit(LookBookController.constructor.name, 'index'), LookBookController.index);

/**
 * @openapi
 * /a/look_books:
 *   post:
 *     tags:
 *      - "[ADMIN] LOOK BOOKS"
 *     summary: Tạo mới lookBook
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin product"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *              description: "Tiêu đề lookBook"
 *            description:
 *              type: "string"
 *              description: "mô tả ngắn lookBook"
 *            thumbnail:
 *              type: "string"
 *              description: "Nội dung lookBook"
 *            status:
 *              type: "string"
 *              description: "Nội dung lookBook"
 *              enum:
 *              - active
 *              - inactive
 *            medias:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  source:
 *                    type: "string"
 *                    description: "link ảnh"
 *            children:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  title:
 *                    type: "string"
 *                    description: "Tiêu đề lookBook"
 *                  description:
 *                    type: "string"
 *                    description: "mô tả ngắn lookBook"
 *                  thumbnail:
 *                    type: "string"
 *                    description: "Nội dung lookBook"
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
router.post('/', Authorization.permit(LookBookController.constructor.name, 'create'), LookBookController.create);

/**
 * @openapi
 * /a/look_books/{lookBookId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] LOOK BOOKS"
 *     summary: Sửa lookBook
 *     parameters:
 *      - in: path
 *        name: "lookBookId"
 *        description: "lookBookId"
 *        type: number
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin product"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *              description: "Tiêu đề lookBook"
 *            description:
 *              type: "string"
 *              description: "mô tả ngắn lookBook"
 *            thumbnail:
 *              type: "string"
 *              description: "Nội dung lookBook"
 *            status:
 *              type: "string"
 *              description: "Nội dung lookBook"
 *              enum:
 *              - active
 *              - inactive
 *            medias:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  id:
 *                    type: "string"
 *                    description: "id media"
 *                  source:
 *                    type: "string"
 *                    description: "media"
 *            children:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  id:
 *                    type: "string"
 *                    description: "id lookBook children"
 *                  title:
 *                    type: "string"
 *                    description: "Tiêu đề lookBook"
 *                  description:
 *                    type: "string"
 *                    description: "mô tả ngắn lookBook"
 *                  thumbnail:
 *                    type: "string"
 *                    description: "Nội dung lookBook"
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
router.patch('/:lookBookId', Authorization.permit(LookBookController.constructor.name, 'update'), LookBookController.update);

/**
 * @openapi
 * /a/look_books/{lookBookId}:
 *   get:
 *     tags:
 *      - "[ADMIN] LOOK BOOKS"
 *     summary: Chi tiết lookBook
 *     parameters:
 *      - in: path
 *        name: "lookBookId"
 *        description: "lookBookId"
 *        type: number
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
router.get('/:lookBookId', Authorization.permit(LookBookController.constructor.name, 'show'), LookBookController.show);

/**
 * @openapi
 * /a/look_books/{lookBookId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] LOOK BOOKS"
 *     summary: Xóa lookBook
 *     parameters:
 *      - in: path
 *        name: "lookBookId"
 *        description: "lookBookId"
 *        type: number
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
router.delete('/:lookBookId', Authorization.permit(LookBookController.constructor.name, 'delete'), LookBookController.delete);

export default router;
