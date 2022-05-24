import FeesController from '@controllers/api/admin/FeesController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/fees:
 *   post:
 *     tags:
 *      - "[ADMIN] FEE"
 *     summary: tính gía vận chuyển
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin"
 *        schema:
 *          type: "object"
 *          properties:
 *            warehouseId:
 *              type: "integer"
 *              description: "Id kho"
 *              default: "null"
 *              require: true
 *            weight:
 *              type: "integer"
 *              description: "Cân nặng"
 *              default: "null"
 *              require: true
 *            length:
 *              type: "integer"
 *              description: "độ dài"
 *              default: "null"
 *              require: true
 *            width:
 *              type: "integer"
 *              description: "độ rộng"
 *              default: "null"
 *              require: true
 *            height:
 *              type: "integer"
 *              description: "chiều cao"
 *              default: "null"
 *              require: true
 *            shippingProvinceId:
 *              type: "string"
 *              description: "địa chỉ mua hàng"
 *              default: "null"
 *              require: true
 *            shippingDistrictId:
 *              type: "string"
 *              description: "địa chỉ mua hàng"
 *              default: "null"
 *              require: true
 *            shippingWardId:
 *              type: "string"
 *              description: "địa chỉ mua hàng"
 *              default: "null"
 *              require: true
 *            insurance_value:
 *              type: "string"
 *              description: "Phí bảo hiểm"
 *              default: "null"
 *              require: true
 *            service_id:
 *              type: "string"
 *              description: "Hình thức giao vận"
 *              default: "null"
 *              require: true
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.post('/', FeesController.create);

/**
 * @openapi
 * /a/fees/services:
 *   post:
 *     tags:
 *      - "[ADMIN] FEE"
 *     summary: Hình thức giao vận
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin"
 *        schema:
 *          type: "object"
 *          properties:
 *            warehouseId:
 *              type: "integer"
 *              description: "Id kho"
 *              default: "null"
 *              require: true
 *            shippingProvinceId:
 *              type: "string"
 *              description: "địa chỉ mua hàng"
 *              default: "null"
 *              require: true
 *            shippingDistrictId:
 *              type: "string"
 *              description: "địa chỉ mua hàng"
 *              default: "null"
 *              require: true
 *            shippingWardId:
 *              type: "string"
 *              description: "địa chỉ mua hàng"
 *              default: "null"
 *              require: true
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.post('/services', FeesController.getServices);

export default router;
