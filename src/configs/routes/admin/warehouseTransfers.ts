import WarehouseTransferController from '@controllers/api/admin/WarehouseTransfersController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/warehouse_transfers:
 *   get:
 *     tags:
 *      - "[ADMIN] Warehouse Transfers"
 *     summary: Danh sach phieu chuyen
 *     description: Danh sach phieu chuyen
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
 *     responses:
 *       200:
 *         description: "Success"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/', WarehouseTransferController.index);

/**
 * @openapi
 * /a/warehouse_transfers:
 *   post:
 *     tags:
 *      - "[ADMIN] Warehouse Transfers"
 *     summary: Tao phieu chuyen kho
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thong tin phieu chuyen kho"
 *        schema:
 *          type: "object"
 *          properties:
 *            fromWarehouseId:
 *              type: "number"
 *              description: "id kho xuat"
 *            toWarehouseId:
 *              type: "number"
 *              description: "id kho nhap"
 *            transferDate:
 *              type: "string"
 *              description: "YYYY-MM-DD"
 *            note:
 *              type: "string"
 *            warehouseTransferVariants:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
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
router.post('/', WarehouseTransferController.create);

export default router;
