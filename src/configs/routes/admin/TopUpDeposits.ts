import TopUpDepositsController from '@controllers/api/admin/TopUpDepositsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/top_up_deposits:
 *   get:
 *     tags:
 *      - "[ADMIN] TOP UP DEPOSIT"
 *     summary: dánh sách nạp tiền
 *     parameters:
 *      - in: "query"
 *        name: "dateFrom"
 *        type: "Date"
 *      - in: "query"
 *        name: "dateTo"
 *        type: "Date"
 *      - in: "query"
 *        name: "freeWord"
 *        type: "string"
 *      - in: "query"
 *        name: "page"
 *        type: "number"
 *      - in: "query"
 *        name: "status"
 *        type: "string"
 *        enum:
 *          - pending
 *          - complete
 *      - in: "query"
 *        name: "type"
 *        type: "string"
 *        enum:
 *          - vnPay
 *          - banking
 *      - in: "query"
 *        name: "sortOrder"
 *        description: "Thứ tự sắp xếp"
 *        type: "string"
 *        enum:
 *          - ASC
 *          - DESC
 *      - in: "query"
 *        name: "sortBy"
 *        type: "string"
 *        description: "Tiêu chí sắp xếp"
 *        enum:
 *          - id
 *          - createdAt
 *     responses:
 *       200:
 *         description: Success.
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.get('/',
  TopUpDepositsController.index);

/**
 * @openapi
 * /a/top_up_deposits/{topUpDepositId}:
 *   get:
 *     tags:
 *      - "[ADMIN] TOP UP DEPOSIT"
 *     summary: Chi tiết nạp tiền
 *     parameters:
 *      - in: "path"
 *        name: "topUpDepositId"
 *        required: true
 *     responses:
 *       200:
 *         description: "Success"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/:topUpDepositId', TopUpDepositsController.show);

/**
 * @openapi
 * /a/top_up_deposits:
 *   post:
 *     tags:
 *      - "[ADMIN] TOP UP DEPOSIT"
 *     summary: Tạo bản ghi
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        schema:
 *          type: "object"
 *          properties:
 *            ownerId:
 *              type: "integer"
 *              description: "Id cộng tác viên"
 *            type:
 *              type: "string"
 *              description: "Loại"
 *              enum:
 *                - vnPay
 *                - banking
 *            status:
 *              type: "string"
 *              description: "Trạng thái"
 *              enum:
 *                - pending
 *                - complete
 *            amount:
 *              type: "integer"
 *              description: "Số tiền"
 *            note:
 *              type: "string"
 *              description: "ghi chú"
 *     responses:
 *       200:
 *         description: Success.
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.post('/', TopUpDepositsController.create);

/**
 * @openapi
 * /a/top_up_deposits/{topUpDepositId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] TOP UP DEPOSIT"
 *     summary: cập nhật
 *     parameters:
 *      - in: "path"
 *        name: "topUpDepositId"
 *        type: "number"
 *      - in: "body"
 *        name: "body"
 *        schema:
 *          type: "object"
 *          properties:
 *            ownerId:
 *              type: "integer"
 *              description: "Id cộng tác viên"
 *            type:
 *              type: "string"
 *              description: "Loại"
 *              enum:
 *                - vnPay
 *                - banking
 *            status:
 *              type: "string"
 *              description: "Trạng thái"
 *              enum:
 *                - pending
 *                - complete
 *            amount:
 *              type: "integer"
 *              description: "Số tiền"
 *            note:
 *              type: "string"
 *              description: "ghi chú"
 *     responses:
 *       200:
 *         description: Success.
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.patch('/:topUpDepositId', TopUpDepositsController.update);

/**
 * @openapi
 * /a/top_up_deposits/{topUpDepositId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] TOP UP DEPOSIT"
 *     summary: Xóa
 *     parameters:
 *      - in: "path"
 *        name: "topUpDepositId"
 *        type: "number"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.delete('/:topUpDepositId', TopUpDepositsController.delete);

export default router;
