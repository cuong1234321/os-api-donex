import WarehouseTransferController from '@controllers/api/admin/WarehouseTransfersController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/warehouse_transfers:
 *   get:
 *     tags:
 *      - "[ADMIN] WAREHOUSE TRANSFERS"
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
 * /a/warehouse_transfers/{warehouseTransferId}:
 *   get:
 *     tags:
 *      - "[ADMIN] WAREHOUSE TRANSFERS"
 *     summary: Chi tiet phieu chuyen
 *     description: Chi tiet phieu chuyen
 *     parameters:
 *      - in: path
 *        name: "warehouseTransferId"
 *        description: "warehouseTransferId"
 *        type: "number"
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
router.get('/:warehouseTransferId', WarehouseTransferController.show);

/**
 * @openapi
 * /a/warehouse_transfers:
 *   post:
 *     tags:
 *      - "[ADMIN] WAREHOUSE TRANSFERS"
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

/**
 * @openapi
 * /a/warehouse_transfers/{warehouseTransferId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] WAREHOUSE TRANSFERS"
 *     summary: Sua phieu chuyen kho
 *     parameters:
 *      - in: path
 *        name: "warehouseTransferId"
 *        description: "warehouseTransferId"
 *        type: "number"
 *      - in: "body"
 *        name: "body"
 *        description: "Thong tin phieu chuyen kho"
 *        schema:
 *          type: "object"
 *          properties:
 *            toWarehouseId:
 *              type: "number"
 *              description: "id kho chuyen den"
 *            transferDate:
 *              type: "string"
 *              description: "YYYY-MM-DD"
 *            note:
 *              type: "string"
 *            status:
 *              type: "string"
 *            warehouseTransferVariants:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  id:
 *                    type: "number"
 *                    description: "id warehouseTransferVariants"
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
router.patch('/:warehouseTransferId', WarehouseTransferController.update);

/**
  * @openapi
  * /a/warehouse_transfers/{warehouseTransferId}/change_status:
  *   patch:
  *     tags:
  *      - "[ADMIN] WAREHOUSE TRANSFERS"
  *     summary: Sua trang thai phieu chuyen kho
  *     parameters:
  *      - in: path
  *        name: "warehouseTransferId"
  *        description: "warehouseTransferId"
  *        type: "number"
  *      - in: "body"
  *        name: "body"
  *        description: "Thong tin phieu chuyen kho"
  *        schema:
  *          type: "object"
  *          properties:
  *            status:
  *              type: "string"
  *              enum:
  *               - confirm
  *               - reject
  *     responses:
  *       200:
  *         description: Return data.
  *       500:
  *         description: Lỗi không xác định
  *     security:
  *      - Bearer: []
  */
router.patch('/:warehouseTransferId/change_status', WarehouseTransferController.changeStatus);

export default router;
