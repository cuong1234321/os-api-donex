import ProductController from '@controllers/api/seller/ProductsController';
import { Request, Response, Router } from 'express';

const router = Router();

/**
 * @openapi
 * /s/products/:
 *   get:
 *     tags:
 *      - "[SELLER] PRODUCT"
 *     summary: Danh sách sản phẩm
 *     description: Danh sách sản phẩm
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "number"
 *      - in: query
 *        name: "size"
 *        description: "size"
 *        type: "number"
 *      - in: query
 *        name: "sku"
 *        description: "ma sku san pham"
 *        type: "string"
 *      - in: query
 *        name: "name"
 *        description: "Ten san pham"
 *        type: "string"
 *      - in: query
 *        name: "category"
 *        description: "Ten danh muc san pham"
 *        type: "string"
 *      - in: query
 *        name: "collectionId"
 *        description: "Ma bo suu tap san pham"
 *        type: "number"
 *      - in: query
 *        name: "unit"
 *        description: "don vi"
 *        type: "string"
 *      - in: query
 *        name: "price"
 *        description: "gia"
 *        type: "number"
 *      - in: query
 *        name: "skuOrder"
 *        description: "sort"
 *        type: "enum"
 *        enum:
 *          - DESC
 *          - ASC
 *      - in: query
 *        name: "nameOrder"
 *        description: "sort"
 *        type: "enum"
 *        enum:
 *          - DESC
 *          - ASC
 *      - in: query
 *        name: "CategoryOrder"
 *        description: "sort"
 *        type: "enum"
 *        enum:
 *          - DESC
 *          - ASC
 *      - in: query
 *        name: "priceOrder"
 *        description: "sort"
 *        type: "enum"
 *        enum:
 *          - DESC
 *          - ASC
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
router.get('/', (req: Request, res: Response) => ProductController.index(req, res));

/**
 * @openapi
 * /s/products/list_products:
 *   get:
 *     tags:
 *      - "[SELLER] PRODUCT"
 *     summary: danh sach san pham to
 *     parameters:
 *      - in: query
 *        name: "productId"
 *        description: "Ma san pham ngan cach boi dau phay"
 *        type: "string"
 *      - in: query
 *        name: "name"
 *        description: "ten san pham"
 *        type: "string"
 *      - in: query
 *        name: "warehouseId"
 *        description: "Ma kho"
 *        type: "number"
 *      - in: query
 *        name: "sku"
 *        description: "Ma sku"
 *        type: "number"
 *     responses:
 *       200:
 *         description: "success"
 *       500:
 *         description: "failed"
 *     security:
 *      - Bearer: []
 */
router.get('/list_products', (req: Request, res: Response) => ProductController.listProducts(req, res));

/**
 * @openapi
 * /s/products/{productId}:
 *   get:
 *     tags:
 *      - "[SELLER] PRODUCT"
 *     summary: Chi tiết sản phẩm
 *     description: Chi tiết sản phẩm
 *     parameters:
 *      - in: path
 *        name: "productId"
 *        description: "productId"
 *        type: "number"
 *     responses:
 *       200:
 *         description: "success"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/:productId', (req: Request, res: Response) => ProductController.show(req, res));

/**
 * @openapi
 * /s/products/{productId}/variants:
 *   get:
 *     tags:
 *      - "[SELLER] PRODUCT"
 *     summary: Danh sách sản phẩm con
 *     description: Danh sách sản phẩm con
 *     parameters:
 *      - in: path
 *        name: "productId"
 *        description: "productId"
 *        type: "number"
 *     responses:
 *       200:
 *         description: "success"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/:productId/variants', (req: Request, res: Response) => ProductController.variantIndex(req, res));

export default router;
