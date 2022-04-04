import ProductVariantController from '@controllers/api/admin/ProductVariantsController';
import { Request, Response, Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/variants/:
 *   get:
 *     tags:
 *      - "[ADMIN] PRODUCT VARIANTS"
 *     summary: Danh sách sản phẩm con
 *     description: Danh sách sản phẩm con
 *     parameters:
 *      - in: query
 *        name: "category"
 *        description: "Id danh muc san pham ngan cach boi dau phay"
 *        type: "string"
 *      - in: query
 *        name: "productId"
 *        description: "Id san pham ngan cach boi dau phay"
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
router.get('/', (req: Request, res: Response) => ProductVariantController.index(req, res));

export default router;
