import { Router } from 'express';
import BannerController from '@controllers/api/admin/BannerController';

const router = Router();

/**
 * @openapi
 * /a/banners/{type}:
 *   get:
 *     tags:
 *      - "[ADMIN] Banners"
 *     summary: Lấy danh sách danh banner
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
router.get('/:type', BannerController.index);

/**
  * @openapi
  * /a/banners/{bannerId}/show:
  *   get:
  *     tags:
  *      - "[ADMIN] Banners"
  *     summary: lấy một banner
  *     parameters:
  *      - in: "path"
  *        name: "bannerId"
  *        description: "id banner"
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
router.get('/:bannerId/show/', BannerController.show);

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

/**
 * @openapi
 * /a/banners/{bannerId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] Banners"
 *     summary: update banner
 *     parameters:
 *      - in: "path"
 *        name: "bannerId"
 *        type: "number"
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
 *            isHighLight:
 *              type: "boolean"
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
router.patch('/:bannerId', BannerController.update);

/**
 * @openapi
 * /a/banners/{type}/{position}/reorder:
 *   patch:
 *     tags:
 *      - "[ADMIN] Banners"
 *     summary: đổi thứ tự bannerId
 *     parameters:
 *      - in: "path"
 *        name: "position"
 *        description: "banner position"
 *        required: true
 *        enum:
 *         - top
 *         - right
 *         - newProductSlide
 *         - newProductBanner
 *         - flashSale
 *         - highlight
 *         - productList
 *         - productDetail
 *      - in: "path"
 *        name: "type"
 *        description: "banner position"
 *        required: true
 *        enum:
 *         - homepage
 *         - product
 *         - profile
 *         - news
 *      - in: "body"
 *        name: "body"
 *        description: "banner id"
 *        schema:
 *          type: "object"
 *          properties:
 *            bannersOrder:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  id:
 *                    type: "number"
 *                    description: "Banner id"
 *                  orderId:
 *                    type: "number"
 *                    description: "Thứ tự sắp xếp"
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
router.patch('/:type/:position/reorder/', BannerController.reorder);

/**
 * @openapi
 * /a/banners/{bannerId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] Banners"
 *     summary: Xóa banner
 *     parameters:
 *      - in: "path"
 *        name: "bannerId"
 *        description: "id banner"
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
router.delete('/:bannerId', BannerController.delete);

export default router;
