import WarehouseReceiptController from '@controllers/api/admin/WarehouseReceiptsController';
import { Router } from 'express';
import Authorization from '@middlewares/authorization';

const router = Router();

/**
 * @openapi
 * /a/warehouse_receipts:
 *   get:
 *     tags:
 *      - "[ADMIN] WAREHOUSE RECEIPTS"
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
router.get('/', Authorization.permit(WarehouseReceiptController.constructor.name, 'index'), WarehouseReceiptController.index);

/**
 * @openapi
 * /a/warehouse_receipts/download:
 *   get:
 *     tags:
 *      - "[ADMIN] WAREHOUSE RECEIPTS"
 *     summary: Tai xuong danh sach phieu nhap
 *     description: Tai xuong danh sach phieu nhap
 *     parameters:
 *      - in: query
 *        name: "warehouseReceiptIds"
 *        type: "string"
 *      - in: query
 *        name: "fromDate"
 *        description: "Ngay bat dau YYYY/MM/DD"
 *        type: "string"
 *      - in: query
 *        name: "toDate"
 *        description: "Ngay ket thuc YYYY/MM/DD"
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
router.get('/download', Authorization.permit(WarehouseReceiptController.constructor.name, 'index'), WarehouseReceiptController.downloadList);

/**
 * @openapi
 * /a/warehouse_receipts/{warehouseReceiptId}:
 *   get:
 *     tags:
 *      - "[ADMIN] WAREHOUSE RECEIPTS"
 *     summary: Chi tiet phieu nhap
 *     description: Chi tiet phieu nhap
 *     parameters:
 *      - in: path
 *        name: "warehouseReceiptId"
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
router.get('/:warehouseReceiptId', Authorization.permit(WarehouseReceiptController.constructor.name, 'show'), WarehouseReceiptController.show);

/**
 * @openapi
 * /a/warehouse_receipts/{warehouseReceiptId}/download:
 *   get:
 *     tags:
 *      - "[ADMIN] WAREHOUSE RECEIPTS"
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
router.get('/:warehouseReceiptId/download', Authorization.permit(WarehouseReceiptController.constructor.name, 'index'), WarehouseReceiptController.download);

/**
 * @openapi
 * /a/warehouse_receipts:
 *   post:
 *     tags:
 *      - "[ADMIN] WAREHOUSE RECEIPTS"
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
router.post('/', Authorization.permit(WarehouseReceiptController.constructor.name, 'create'), WarehouseReceiptController.create);

/**
 * @openapi
 * /a/warehouse_receipts/{warehouseReceiptId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] WAREHOUSE RECEIPTS"
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
router.patch('/:warehouseReceiptId', Authorization.permit(WarehouseReceiptController.constructor.name, 'update'), WarehouseReceiptController.update);

export default router;
