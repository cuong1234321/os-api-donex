import RatingsController from '@controllers/api/user/RatingsController';
import { withoutSavingUploader } from '@middlewares/uploaders';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/ratings/{subOrderId}/sub_orders/{productVariantId}:
 *   post:
 *     tags:
 *      - "[USER] Ratings"
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
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.post('/:subOrderId/sub_orders/:productVariantId', RatingsController.create);

/**
 * @openapi
 * /u/ratings/{ratingId}:
 *   patch:
 *     tags:
 *      - "[USER] Comments"
 *     summary: Tạo mới image
 *     parameters:
 *      - in: "path"
 *        name: "ratingId"
 *        description: ""
 *        required: true
 *        type: "number"
 *      - in: "formData"
 *        name: "files"
 *        description: "File upload"
 *        required: false
 *        allowMultiple: true
 *        type: "file"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/:ratingId',
  withoutSavingUploader.array('files'), RatingsController.uploadImage);

export default router;
