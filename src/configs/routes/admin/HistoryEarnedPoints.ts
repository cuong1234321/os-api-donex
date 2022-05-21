import HistoryEarnedPointsController from '@controllers/api/admin/HistoryEarnedPointsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/history_earned_points:
 *   get:
 *     tags:
 *      - "[ADMIN] HISTORY EARNED POINT"
 *     summary: Lấy danh sách lịch sử điểm thưởng
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "string"
 *      - in: query
 *        name: "size"
 *        description: "size"
 *        type: "string"
 *      - in: query
 *        name: "userId"
 *        description: ""
 *        type: "string"
 *      - in: query
 *        name: "userType"
 *        description: ""
 *        type: "string"
 *        enum:
 *          - user
 *          - collaborator
 *          - agency
 *          - distributor
 *      - in: query
 *        name: "fromDate"
 *        description: "từ ngày"
 *        type: "string"
 *      - in: query
 *        name: "toDate"
 *        description: "đến ngày"
 *        type: "string"
 *      - in: query
 *        name: "sortOrder"
 *        description: "Thứ tự sắp xếp"
 *        type: "string"
 *        enum:
 *          - ASC
 *          - DESC
 *      - in: query
 *        name: "type"
 *        description: ""
 *        type: "string"
 *        enum:
 *          - add
 *          - subtract
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/', HistoryEarnedPointsController.index);

export default router;
