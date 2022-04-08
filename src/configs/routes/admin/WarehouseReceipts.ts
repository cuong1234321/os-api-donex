import WarehouseReceiptController from '@controllers/api/admin/WarehouseReceiptsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/warehouse_receipts:
 *   get:
 *     tags:
 *      - "[ADMIN] Warehouse Receipts"
 *     summary: Danh sach phieu nhap
 *     description: Danh sach phieu nhap
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
 *         - orderRefund
 *         - newGoods
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
router.get('/', WarehouseReceiptController.index);

/**
 * @openapi
 * /a/warehouse_receipts/{warehouseReceiptId}:
 *   get:
 *     tags:
 *      - "[ADMIN] Warehouse Receipts"
 *     summary: Chi tiet phieu nhap
 *     description: Chi tiet phieu nhap
 *     parameters:
 *      - in: path
 *        name: "warehouseReceiptId"
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
router.get('/:warehouseReceiptId', WarehouseReceiptController.show);

/**
 * @openapi
 * /a/warehouse_receipts:
 *   post:
 *     tags:
 *      - "[ADMIN] Warehouse Receipts"
 *     summary: Tao phieu nhap
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thong tin phieu nhap"
 *        schema:
 *          type: "object"
 *          properties:
 *            importDate:
 *              type: "string"
 *              description: "YYYY-MM-DD"
 *            importAbleType:
 *              type: "string"
 *              enum:
 *               - customer
 *               - collaborator
 *               - agency
 *               - distributor
 *            importAble:
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
 *               - orderRefund
 *               - newGoods
 *               - others
 *            warehouseReceiptVariants:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  warehouseId:
 *                    type: "number"
 *                    description: "Ma kho nhap"
 *                  variantId:
 *                    type: "number"
 *                    description: "Ma san pham variant"
 *                  quantity:
 *                    type: "number"
 *                    description: "So luong nhap"
 *                  price:
 *                    type: "number"
 *                    description: "Gia nhap"
 *                  totalPrice:
 *                    type: "number"
 *                    description: "Tong gia nhap"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.post('/', WarehouseReceiptController.create);

/**
 * @openapi
 * /a/warehouse_receipts/{warehouseReceiptId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] Warehouse Receipts"
 *     summary: Sua phieu nhap
 *     parameters:
 *      - in: "path"
 *        name: "warehouseReceiptId"
 *      - in: "body"
 *        name: "body"
 *        description: "Thong tin phieu nhap"
 *        schema:
 *          type: "object"
 *          properties:
 *            importDate:
 *              type: "string"
 *              description: "YYYY-MM-DD"
 *            importAbleType:
 *              type: "string"
 *              enum:
 *               - customer
 *               - collaborator
 *               - agency
 *               - distributor
 *            importAble:
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
 *               - orderRefund
 *               - newGoods
 *               - others
 *            warehouseReceiptVariants:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  id:
 *                    type: "number"
 *                    description: "id warehouseReceiptVariant"
 *                  warehouseId:
 *                    type: "number"
 *                    description: "Ma kho nhap"
 *                  variantId:
 *                    type: "number"
 *                    description: "Ma san pham variant"
 *                  quantity:
 *                    type: "number"
 *                    description: "So luong nhap"
 *                  price:
 *                    type: "number"
 *                    description: "Gia nhap"
 *                  totalPrice:
 *                    type: "number"
 *                    description: "Tong gia nhap"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/:warehouseReceiptId', WarehouseReceiptController.update);

export default router;
