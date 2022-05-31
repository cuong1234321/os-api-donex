import SizeGuidesController from '@controllers/api/user/SizeGuidesController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/size_guides/:
 *   get:
 *     tags:
 *      - "[USER] SIZE GUIDES"
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
 * /u/size_guides/size_type:
 *   get:
 *     tags:
 *      - "[USER] SIZE GUIDES"
 *     summary: Xem danh sach
 *     parameters:
 *      - in: "query"
 *        name: sizeType
 *        description: "Loai size"
 *        enum:
 *          - kidSize
 *          - adultSize
 *          - shoesSize
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/size_type', SizeGuidesController.indexQuery);

export default router;
