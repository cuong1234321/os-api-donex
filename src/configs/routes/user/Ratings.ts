import RatingsController from '@controllers/api/user/RatingsController';
import { userPassport } from '@middlewares/passport';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/ratings/{subOrderId}/sub_orders/{productVariantId}:
 *   post:
 *     tags:
 *      - "[USER] RATING"
 *     summary: tạo mới đánh giá
 *     parameters:
 *      - in: path
 *        name: "subOrderId"
 *        description: "subOrderId"
 *        type: "string"
 *      - in: path
 *        name: "productVariantId"
 *        description: "productVariantId"
 *        type: "string"
 *      - in: "body"
 *        name: "body"
 *        description: "noi dung"
 *        schema:
 *          type: "object"
 *          properties:
 *            content:
 *              type: "string"
 *              description: "Nội dung"
 *            point:
 *              type: "number"
 *              description: "0 - 5"
 *            isAnonymous:
 *              type: "boolean"
 *              description: "danh gia an danh"
 *              default: 0
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.post('/:subOrderId/sub_orders/:productVariantId', userPassport.authenticate('jwt', { session: false }), RatingsController.create);

/**
 * @openapi
 * /u/ratings/{ratingId}:
 *   patch:
 *     tags:
 *      - "[USER] RATING"
 *     summary: Tạo mới image
 *     parameters:
 *      - in: path
 *        name: "ratingId"
 *        description: "ratingId"
 *        type: "string"
 *      - in: "body"
 *        name: "body"
 *        description: "noi dung"
 *        schema:
 *          type: "object"
 *          properties:
 *            medias:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  source:
 *                    type: "string"
 *                    description: "source"
 *                  type:
 *                    type: "string"
 *                    description: "dạng dữ liệu"
 *                    enum:
 *                      - image
 *                      - video
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/:ratingId', userPassport.authenticate('jwt', { session: false }), RatingsController.update);

/**
 * @openapi
 * /u/ratings/:
 *   get:
 *     tags:
 *      - "[USER] RATING"
 *     summary: Lấy danh sách rating
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "string"
 *      - in: query
 *        name: "productId"
 *        description: "product id"
 *        type: "number"
 *      - in: query
 *        name: "point"
 *        description: "point"
 *        type: "number"
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/', RatingsController.index);

export default router;
