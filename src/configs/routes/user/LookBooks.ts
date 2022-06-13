import { Router } from 'express';
import LookBookController from '@controllers/api/user/LookBooksController';

const router = Router();

/**
 * @openapi
 * /u/look_books:
 *   get:
 *     tags:
 *      - "[USER] LOOK BOOKS"
 *     summary: Lấy danh sách lookBook
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
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
router.get('/', LookBookController.index);

/**
 * @openapi
 * /u/look_books/{lookBookId}:
 *   get:
 *     tags:
 *      - "[USER] LOOK BOOKS"
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
router.get('/:lookBookId', LookBookController.show);

export default router;
