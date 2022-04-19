import WarehouseExportController from '@controllers/api/admin/WarehouseExportsController';
import { Router } from 'express';

const router = Router();
/**
 * @openapi
 * /a/warehouse_exports:
 *   get:
 *     tags:
 *      - "[ADMIN] Warehouse Exports"
 *     summary: Danh sach phieu xuat
 *     description: Danh sach phieu xuat
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
 *        name: "fromDate"
 *        description: "Ngay bat dau"
 *        type: "string"
 *      - in: query
 *        name: "toDate"
 *        description: "Ngay ket thuc"
 *        type: "string"
 *      - in: query
 *        name: "type"
 *        description: ""
 *        enum:
 *         - sell
 *         - others
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
router.get('/', WarehouseExportController.index);

/**
 * @openapi
 * /a/warehouse_exports/{warehouseExportId}:
 *   get:
 *     tags:
 *      - "[ADMIN] Warehouse Exports"
 *     summary: Chi tiet phieu xuat
 *     description: Chi tiet phieu xuat
 *     parameters:
 *      - in: path
 *        name: "warehouseExportId"
 *        type: "number"
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
router.get('/:warehouseExportId', WarehouseExportController.show);

/**
 * @openapi
 * /a/warehouse_exports:
 *   post:
 *     tags:
 *      - "[ADMIN] Warehouse Exports"
 *     summary: Tao phieu xuat
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thong tin phieu xuat"
 *        schema:
 *          type: "object"
 *          properties:
 *            exportDate:
 *              type: "string"
 *              description: "YYYY-MM-DD"
 *            exportAbleType:
 *              type: "string"
 *              enum:
 *               - customer
 *               - collaborator
 *               - agency
 *               - distributor
 *            exportAble:
 *              type: "string"
 *            orderId:
 *              type: "number"
 *            deliverer:
 *              type: "string"
 *              description: "nguoi giao"
 *            note:
 *              type: "string"
 *            type:
 *              type: "string"
 *              enum:
 *               - sell
 *               - others
 *            warehouseExportVariants:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  warehouseId:
 *                    type: "number"
 *                    description: "Ma kho xuat"
 *                  variantId:
 *                    type: "number"
 *                    description: "Ma san pham variant"
 *                  quantity:
 *                    type: "number"
 *                    description: "So luong xuat"
 *                  price:
 *                    type: "number"
 *                    description: "Gia xuat"
 *                  totalPrice:
 *                    type: "number"
 *                    description: "Tong gia xuat"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.post('/', WarehouseExportController.create);

/**
 * @openapi
 * /a/warehouse_exports/{warehouseExportId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] Warehouse Exports"
 *     summary: Sua phieu xuat
 *     parameters:
 *      - in: "path"
 *        name: "warehouseExportId"
 *      - in: "body"
 *        name: "body"
 *        description: "Thong tin phieu xuat"
 *        schema:
 *          type: "object"
 *          properties:
 *            exportDate:
 *              type: "string"
 *              description: "YYYY-MM-DD"
 *            exportAbleType:
 *              type: "string"
 *              enum:
 *               - customer
 *               - collaborator
 *               - agency
 *               - distributor
 *            exportAble:
 *              type: "string"
 *            orderId:
 *              type: "number"
 *            deliverer:
 *              type: "string"
 *              description: "nguoi giao"
 *            note:
 *              type: "string"
 *            type:
 *              type: "string"
 *              enum:
 *               - sell
 *               - others
 *            warehouseExportVariants:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  id:
 *                    type: "number"
 *                    description: "Id warehouseExportVariants"
 *                  warehouseId:
 *                    type: "number"
 *                    description: "Ma kho xuat"
 *                  variantId:
 *                    type: "number"
 *                    description: "Ma san pham variant"
 *                  quantity:
 *                    type: "number"
 *                    description: "So luong xuat"
 *                  price:
 *                    type: "number"
 *                    description: "Gia xuat"
 *                  totalPrice:
 *                    type: "number"
 *                    description: "Tong gia xuat"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/:warehouseExportId', WarehouseExportController.update);

export default router;