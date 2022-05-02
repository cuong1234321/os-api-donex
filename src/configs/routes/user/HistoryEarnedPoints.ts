import HistoryEarnedPointsController from '@controllers/api/user/HistoryEarnedPointsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/history_earned_points:
 *   get:
 *     tags:
 *      - "[USER] HISTORY EARNED POINT"
 *     summary: Lấy danh sách lịch sử điểm thưởng
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "string"
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "string"
 *      - in: query
 *        name: "createdAtFrom"
 *        description: "từ ngày"
 *        type: "string"
 *      - in: query
 *        name: "createdAtTo"
 *        description: "đến ngày"
 *        type: "string"
 *      - in: query
 *        name: "sortOrder"
 *        description: "Thứ tự sắp xếp"
 *        type: "string"
 *        enum:
 *          - ASC
 *          - DESC
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
