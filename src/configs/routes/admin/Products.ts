import ProductController from '@controllers/api/admin/ProductController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/products:
 *   post:
 *     tags:
 *      - "[ADMIN] PRODUCT"
 *     summary: Tạo mới product
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin product"
 *        schema:
 *          type: "object"
 *          properties:
 *            name:
 *              type: "string"
 *              description: "Tên sản phẩm"
 *              default: "Tên Sản phẩm"
 *            description:
 *              type: "string"
 *              description: "mô tả"
 *            shortDescription:
 *              type: "string"
 *              description: "Mô tả ngắn"
 *              default: "Mô tả ngắn"
 *            gender:
 *              type: "number"
 *              description: "Giới tính"
 *            typeProductId:
 *              type: "number"
 *              description: "loại sản phẩm"
 *            sizeGuide:
 *              type: "string"
 *              description: "Hướng dẫn sử dụng"
 *              default: ""
 *            unit:
 *              type: "string"
 *              description: "Đơn vị"
 *              default: ""
 *            minStock:
 *              type: "number"
 *              description: "Tồn kho tối thiểu"
 *              default: "1"
 *            maxStock:
 *              type: "number"
 *              description: "Tồn kho tối đa"
 *              default: "100"
 *            weight:
 *              type: "number"
 *              description: "Cân nặng"
 *              default: null
 *            length:
 *              type: "number"
 *              description: "Độ dài"
 *              default: null
 *            width:
 *              type: "number"
 *              description: "Chiều rộng"
 *              default: null
 *            height:
 *              type: "number"
 *              description: "Chiều cao"
 *              default: null
 *            categoryRefs:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  productCategoryId:
 *                    type: "integer"
 *                    description: "Id danh mục"
 *            options:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  key:
 *                    type: "string"
 *                    description: "Tên thuộc tính"
 *                  value:
 *                    type: "number"
 *                    description: "id thuộc tính"
 *                  optionMappingId:
 *                    type: "number"
 *                    description: "Mã phân loại con tự sinh"
 *            variants:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  name:
 *                    type: "string"
 *                    description: ""
 *                  buyPrice:
 *                    type: "integer"
 *                    description: "Đơn giá"
 *                  sellPrice:
 *                    type: "integer"
 *                    description: "Đơn giá"
 *                  optionMappingIds:
 *                    type: "array"
 *                    description: "Mã nhóm phân loại"
 *                    items:
 *                      type: "integer"
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
router.post('/', ProductController.create);

export default router;
