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
 *      - in: query
 *        name: "appliedAt"
 *        description: "ngày bắt đầu chương trình"
 *        type: "string"
 *        default: "2022-01-01"
 *      - in: query
 *        name: "appliedTo"
 *        description: "ngày kết thúc chương trình"
 *        type: "string"
 *        default: "2023-01-01"
 *      - in: query
 *        name: "beneficiaries"
 *        description: "ĐỐi tượng áp dụng, cách nhau bởi dấu phẩy"
 *        type: "string"
 *        default: "user, collaborator, agency, distributor"
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
