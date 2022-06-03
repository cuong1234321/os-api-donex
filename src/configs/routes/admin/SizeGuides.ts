import SizeGuidesController from '@controllers/api/admin/SizeGuidesController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/size_guides/:
 *   get:
 *     tags:
 *      - "[ADMIN] SIZE GUIDES"
 *     summary: Xem danh sach
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/', SizeGuidesController.index);

/**
 * @openapi
 * /a/size_guides/{sizeGuideId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] SIZE GUIDES"
 *     summary: xoa
 *     parameters:
 *      - in: "path"
 *        name: "sizeGuideId"
 *        type: "string"
 *        description: "sizeGuideId"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.delete('/:sizeGuideId', SizeGuidesController.delete);

/**
 * @openapi
 * /a/size_guides/:
 *   post:
 *     tags:
 *      - "[ADMIN] SIZE GUIDES"
 *     summary: chinh sua
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin size"
 *        schema:
 *          type: "object"
 *          properties:
 *            sizeType:
 *              type: "string"
 *              description: "kieu size"
 *              default: "kieu size"
 *              enum:
 *                - kidSize
 *                - adultSize
 *                - shoesSize
 *            source:
 *              type: "string"
 *              description: "source"
 *              default: "source"
 *            mediaType:
 *              type: "string"
 *              description: "dang du lieu"
 *              enum:
 *                - image
 *                - video
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.post('/', SizeGuidesController.create);

/**
 * @openapi
 * /a/size_guides/{sizeGuideId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] SIZE GUIDES"
 *     summary: Tao moi
 *     parameters:
 *      - in: "path"
 *        name: "sizeGuideId"
 *        type: "string"
 *        description: "sizeGuideId"
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin size"
 *        schema:
 *          type: "object"
 *          properties:
 *            source:
 *              type: "string"
 *              description: "source"
 *              default: "source"
 *            mediaType:
 *              type: "string"
 *              description: "dang du lieu"
 *              enum:
 *                - image
 *                - video
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.patch('/:sizeGuideId', SizeGuidesController.update);

export default router;
