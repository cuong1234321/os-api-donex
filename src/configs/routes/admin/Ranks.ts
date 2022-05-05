import RanksController from '@controllers/api/admin/RanksController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/ranks/:
 *   get:
 *     tags:
 *      - "[ADMIN] RANK"
 *     summary: Xem chi tiết
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/', RanksController.show);

/**
 * @openapi
 * /a/ranks/:
 *   patch:
 *     tags:
 *      - "[ADMIN] RANK"
 *     summary: Chỉnh sửa rank
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin rank"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *              description: "Tên"
 *            orderValueFrom:
 *              type: "number"
 *              description: "giá trị đơn hàng tối thiểu"
 *            dateEarnDiscount:
 *              type: "array"
 *              description: "các ngày áp dụng chương trình giảm giá"
 *              items:
 *                type: "string"
 *                enum:
 *                  - 1
 *                  - 2
 *                  - 3
 *                  - 4
 *            description:
 *              type: "string"
 *              description: "Mô tả"
 *            conditions:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  id:
 *                    type: "integer"
 *                    description: "Id của điều kiện đã tồn tại"
 *                  orderAmountFrom:
 *                    type: "integer"
 *                    description: "Mức đơn hàng tối thiểu"
 *                  orderAmountTo:
 *                    type: "integer"
 *                    description: "Mức đơn hàng tối đa"
 *                  discountValue:
 *                    type: "integer"
 *                    description: "Giá trị"
 *                  discountType:
 *                    type: "string"
 *                    description: "Dạng giảm"
 *                    enum:
 *                      - cash
 *                      - percent
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.patch('/', RanksController.update);

export default router;
