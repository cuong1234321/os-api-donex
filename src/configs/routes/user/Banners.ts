import { Router } from 'express';
import BannerController from '@controllers/api/user/BannersController';

const router = Router();

/**
 * @openapi
 * /u/banners/{type}:
 *   get:
 *     tags:
 *      - "[USER] BANNERS"
 *     summary: Danh sách banners
 *     parameters:
 *      - in: path
 *        name: "type"
 *        description: "trang hien thi banner"
 *        type: "string"
 *        enum:
 *         - homepage
 *         - product
 *         - profile
 *         - news
 *      - in: query
 *        name: "position"
 *        type: "string"
 *        description: "vi tri banner"
 *        enum:
 *         - top
 *         - right
 *         - newProductSlide
 *         - newProductBanner
 *         - flashSale
 *         - highlight
 *         - productList
 *         - productDetail
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/:type', BannerController.index);

export default router;
