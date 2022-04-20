import { Router } from 'express';
import BannerController from '@controllers/api/admin/BannerController';

const router = Router();

/**
 * @openapi
 * /a/banners/:
 *   get:
 *     tags:
 *      - "[ADMIN] Banners"
 *     summary: Lấy danh sách danh banner
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "string"
 *      - in: query
 *        name: "title"
 *        description: "title"
 *        type: "string"
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
 *      - in: query
 *        name: "type"
 *        type: "string"
 *        description: "trang hien thi banner"
 *        enum:
 *         - homepage
 *         - product
 *         - profile
 *         - news
 *      - in: query
 *        name: "isHighlight"
 *        description: "Trạng thái hiển thị"
 *        type: "boolean"
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/', BannerController.index);

/**
 * @openapi
 * /a/banners:
 *   post:
 *     tags:
 *      - "[ADMIN] Banners"
 *     summary: Tạo mới banner
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin banner"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *              description: "Tiêu đề banner"
 *            linkDirect:
 *              type: "string"
 *            position:
 *              type: "string"
 *              description: "vi tri banner"
 *              enum:
 *               - top
 *               - right
 *               - newProductSlide
 *               - newProductBanner
 *               - flashSale
 *               - highlight
 *               - productList
 *               - productDetail
 *            image:
 *              type: "string"
 *              description: "duong dan anh"
 *            type:
 *              type: "string"
 *              description: "trang hien thi banner"
 *              enum:
 *               - homepage
 *               - product
 *               - profile
 *               - news
 *     responses:
 *       200:
 *         description: Return data.
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Error can't get data.
 *     security:
 *      - Bearer: []
 */
router.post('/', BannerController.create);

export default router;
