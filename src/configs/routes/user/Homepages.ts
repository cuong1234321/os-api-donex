import { Request, Response, Router } from 'express';
import HomepageController from '@controllers/api/user/HomepageControllers';

const router = Router();

/**
 * @openapi
 * /u/homepages:
 *   get:
 *     tags:
 *      - "[USER] Homepage"
 *     summary: Trang chủ
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/', (req: Request, res: Response) => HomepageController.index(req, res));

export default router;
