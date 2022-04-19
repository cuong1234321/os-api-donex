import { Router } from 'express';
import WarehouseController from '@controllers/api/admin/WarehousesController';

const router = Router();

/**
 * @openapi
 * /a/warehouses/:
 *   get:
 *     tags:
 *      - "[ADMIN] Warehouses"
 *     summary: Danh sách kho hàng
 *     description: Danh sách kho hàng
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
 *        name: "freeWord"
 *        description: "freeWord"
 *        type: "string"
 *      - in: query
 *        name: "type"
 *        description: "loai kho"
 *        type: "string"
 *        enum:
 *         - storage
 *         - sell
 *      - in: query
 *        name: "status"
 *        description: "trang thai"
 *        type: "string"
 *        enum:
 *          - active
 *          - inactive
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
router.get('/', WarehouseController.index);

/**
 * @openapi
 * /a/warehouses/{warehouseId}:
 *   get:
 *     tags:
 *      - "[ADMIN] Warehouses"
 *     summary: Chi tiet kho hang
 *     parameters:
 *      - in: path
 *        name: "warehouseId"
 *        description: "id kho"
 *        required: true
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
router.get('/:warehouseId', WarehouseController.show);

/**
 * @openapi
 * /a/warehouses:
 *   post:
 *     tags:
 *      - "[ADMIN] Warehouses"
 *     summary: Tao moi kho hang
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thong tin kho hang"
 *        schema:
 *          type: "object"
 *          properties:
 *            code:
 *              type: "string"
 *              description: "ma kho"
 *            name:
 *              type: "string"
 *              description: "ten kho"
 *            type:
 *              type: "string"
 *              description: ""
 *              enum:
 *                - storage
 *                - sell
 *            description:
 *              type: "string"
 *              description: "mo ta"
 *            provinceId:
 *              type: number
 *            districtId:
 *              type: number
 *            wardId:
 *              type: number
 *            address:
 *              type: "string"
 *            phoneNumber:
 *              type: "string"
 *            warehouseManager:
 *              type: "string"
 *              description: "truong kho"
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
router.post('/', WarehouseController.create);

/**
 * @openapi
 * /a/warehouses/{warehouseId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] Warehouses"
 *     summary: Cap nhat kho hang
 *     parameters:
 *      - in: path
 *        name: "warehouseId"
 *        description: "id kho"
 *        required: true
 *      - in: "body"
 *        name: "body"
 *        description: "Thong tin kho hang"
 *        schema:
 *          type: "object"
 *          properties:
 *            code:
 *              type: "string"
 *              description: "ma kho"
 *            name:
 *              type: "string"
 *              description: "ten kho"
 *            type:
 *              type: "string"
 *              description: ""
 *              enum:
 *                - storage
 *                - sell
 *            description:
 *              type: "string"
 *              description: "mo ta"
 *            status:
 *              type: "string"
 *              description: ""
 *              enum:
 *                - active
 *                - inactive
 *            provinceId:
 *              type: number
 *            districtId:
 *              type: number
 *            wardId:
 *              type: number
 *            address:
 *              type: "string"
 *            phoneNumber:
 *              type: "string"
 *            warehouseManager:
 *              type: "string"
 *              description: "truong kho"
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
router.patch('/:warehouseId', WarehouseController.update);

/**
 * @openapi
 * /a/warehouses/{warehouseId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] Warehouses"
 *     summary: Xoa kho hang
 *     parameters:
 *      - in: path
 *        name: "warehouseId"
 *        description: "id kho"
 *        required: true
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
router.delete('/:warehouseId', WarehouseController.delete);

export default router;
