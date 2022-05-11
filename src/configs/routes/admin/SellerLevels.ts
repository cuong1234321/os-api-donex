import { Router } from 'express';
import SellerLevelsController from '@controllers/api/admin/SellerLevelsController';

const router = Router();

/**
 * @openapi
 * /a/seller_levels:
 *   get:
 *     tags:
 *      - "[ADMIN] SELLER LEVELS"
 *     summary: Dan sach level
 *     parameters:
 *      - in: "query"
 *        name: "type"
 *        description: ""
 *        enum:
 *         - collaborator
 *         - agency
 *         - distributor
 *      - in: "query"
 *        name: "sortBy"
 *        enum:
 *         - createdAt
 *         - conditionValue
 *         - discountValue
 *      - in: "query"
 *        name: "sortOrder"
 *        enum:
 *         - ASC
 *         - DESC
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/', SellerLevelsController.index);

/**
 * @openapi
 * /a/seller_levels/{levelId}:
 *   get:
 *     tags:
 *      - "[ADMIN] SELLER LEVELS"
 *     summary: xem chi tiet level
 *     parameters:
 *      - in: "path"
 *        name: "levelId"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/:levelId', SellerLevelsController.show);

/**
 * @openapi
 * /a/seller_levels:
 *   post:
 *     tags:
 *      - "[ADMIN] SELLER LEVELS"
 *     summary: Thêm mới level
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin level"
 *        schema:
 *          type: "object"
 *          properties:
 *            type:
 *              type: "string"
 *              description: ""
 *              enum:
 *               - collaborator
 *               - agency
 *               - distributor
 *            title:
 *              type: "string"
 *              description: "ten cap"
 *            conditionValue:
 *              type: "number"
 *              description: "dieu kien len cap"
 *            discountValue:
 *              type: "number"
 *              description: "muc chiet khau"
 *            description:
 *              type: "string"
 *              description: "mo ta"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.post('/', SellerLevelsController.create);

/**
 * @openapi
 * /a/seller_levels/{levelId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] SELLER LEVELS"
 *     summary: update level
 *     parameters:
 *      - in: "path"
 *        name: "levelId"
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin level"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *              description: "ten cap"
 *            conditionValue:
 *              type: "number"
 *              description: "dieu kien len cap"
 *            discountValue:
 *              type: "number"
 *              description: "muc chiet khau"
 *            description:
 *              type: "string"
 *              description: "mo ta"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/:levelId', SellerLevelsController.update);

/**
 * @openapi
 * /a/seller_levels/{levelId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] SELLER LEVELS"
 *     summary: xoa level
 *     parameters:
 *      - in: "path"
 *        name: "levelId"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.delete('/:levelId', SellerLevelsController.delete);

export default router;
