import WithdrawalRequestController from '@controllers/api/admin/WithdrawalRequestsController';
import Authorization from '@middlewares/authorization';
import { Router } from 'express';

const router = Router({ mergeParams: true });

/**
 * @openapi
 * /a/withdrawal_requests:
 *   get:
 *     tags:
 *      - "[ADMIN] WITHDRAWAL REQUESTS"
 *     summary: Danh sách yêu cầu rút tiền
 *     parameters:
 *       - in: "query"
 *         name: "page"
 *         description: "xem trang bao nhiêu"
 *         type: "number"
 *       - in: query
 *         name: "createdAtFrom"
 *         type: "string"
 *       - in: query
 *         name: "createdAtTo"
 *         type: "string"
 *       - in: "query"
 *         name: "freeWord"
 *         type: "string"
 *       - in: "query"
 *         name: "bankIds"
 *         type: "string"
 *       - in: "query"
 *         name: "ownerId"
 *         type: "string"
 *       - in: "query"
 *         name: "status"
 *         type: "string"
 *         enum:
 *           - pending
 *           - approved
 *           - rejected
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.get('/',
  Authorization.permit(WithdrawalRequestController.constructor.name, 'index'),
  WithdrawalRequestController.index);

/**
 * @openapi
 * /a/withdrawal_requests/{requestId}:
 *   get:
 *     tags:
 *      - "[ADMIN] WITHDRAWAL REQUESTS"
 *     summary: Chi tiết yêu cầu rút tiền
 *     parameters:
 *       - in: "path"
 *         name: "requestId"
 *         type: "integer"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.get('/:requestId',
  Authorization.permit(WithdrawalRequestController.constructor.name, 'show'),
  WithdrawalRequestController.show);

/**
 * @openapi
 * /a/withdrawal_requests/{requestId}/approve:
 *   patch:
 *     tags:
 *      - "[ADMIN] WITHDRAWAL REQUESTS"
 *     summary: Chi tiết yêu cầu rút tiền
 *     parameters:
 *       - in: "path"
 *         name: "requestId"
 *         type: "integer"
 *       - in: "body"
 *         name: "body"
 *         schema:
 *           type: "object"
 *           properties:
 *             approvalNote:
 *               type: "string"
 *               description: "Ghi chú"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.patch('/:requestId/approve',
  Authorization.permit(WithdrawalRequestController.constructor.name, 'approve'),
  WithdrawalRequestController.approve);

/**
 * @openapi
 * /a/withdrawal_requests/{requestId}/reject:
 *   patch:
 *     tags:
 *      - "[ADMIN] WITHDRAWAL REQUESTS"
 *     summary: Chi tiết yêu cầu rút tiền
 *     parameters:
 *       - in: "path"
 *         name: "requestId"
 *         type: "integer"
 *       - in: "body"
 *         name: "body"
 *         schema:
 *           type: "object"
 *           properties:
 *             approvalNote:
 *               type: "string"
 *               description: "Ghi chú"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.patch('/:requestId/reject',
  Authorization.permit(WithdrawalRequestController.constructor.name, 'reject'),
  WithdrawalRequestController.reject);

export default router;
