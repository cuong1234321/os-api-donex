import ProductController from '@controllers/api/user/ProductsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/products:
 *   get:
 *     tags:
 *      - "[USER] PRODUCTS"
 *     summary: Lấy danh sách sản phẩm
 *     parameters:
 *       - in: "query"
 *         name: "page"
 *         description: "xem trang bao nhiêu"
 *         type: "number"
 *       - in: "query"
 *         name: "categoryIds"
 *         description: "Danh muc ngan cach boi dau phay"
 *         type: "string"
 *       - in: "query"
 *         name: "genderIds"
 *         description: "Danh muc theo gioi tinh ngan cach boi dau phay"
 *         type: "string"
 *       - in: "query"
 *         name: "collectionIds"
 *         description: "Bo suu tap ngan cach boi dau phay"
 *         type: "string"
 *       - in: "query"
 *         name: "productTypeIds"
 *         description: "Loai san pham ngan cach boi dau phay"
 *         type: "string"
 *       - in: "query"
 *         name: "colorIds"
 *         description: "Loai san pham ngan cach boi dau phay"
 *         type: "string"
 *       - in: "query"
 *         name: "sizeIds"
 *         description: "Loai san pham ngan cach boi dau phay"
 *         type: "string"
 *       - in: "query"
 *         name: "priceFrom"
 *         description: "Giá từ"
 *         type: "number"
 *       - in: "query"
 *         name: "priceTo"
 *         description: "Giá đến"
 *         type: "number"
 *       - in: "query"
 *         name: "freeWord"
 *         description: "Từ khóa"
 *         type: string
 *       - in: query
 *         name: "price"
 *         description: "sap xep theo gia tien"
 *         enum:
 *           - DESC
 *           - ASC
 *       - in: query
 *         name: "createdAtOrder"
 *         description: "sap xep theo thoi gian"
 *         enum:
 *           - DESC
 *           - ASC
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */

router.get('/', ProductController.index);

export default router;
