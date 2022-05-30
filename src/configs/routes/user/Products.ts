import ProductsController from '@controllers/api/user/ProductsController';
import { Request, Response, Router } from 'express';
import { authGuest } from '@middlewares/auth';

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
 *       - in: "query"
 *         name: "rating"
 *         description: "rating"
 *         type: number
 *       - in: "query"
 *         name: "warehouseId"
 *         description: "kho hàng"
 *         type: number
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

router.get('/', authGuest, (req: Request, res: Response) => ProductsController.index(req, res));

/**
 * @openapi
 * /u/products/verify:
 *   get:
 *     tags:
 *      - "[USER] PRODUCTS"
 *     summary: Xac thuc sản phẩm
 *     parameters:
 *      - in: "query"
 *        name: "sku"
 *        type: "string"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/verify', (req: Request, res: Response) => ProductsController.verifyProduct(req, res));

/**
 * @openapi
 * /u/products/{productId}:
 *   get:
 *     tags:
 *      - "[USER] PRODUCTS"
 *     summary: Thông tin sản phẩm
 *     parameters:
 *      - in: "path"
 *        name: "productId"
 *        type: "integer"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/:productId', authGuest, (req: Request, res: Response) => ProductsController.show(req, res));

export default router;
