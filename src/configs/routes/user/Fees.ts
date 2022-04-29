import FeesController from '@controllers/api/user/FeesController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /u/fees:
 *   post:
 *     tags:
 *      - "[USER] FEE"
 *     summary: tính gía vận chuyển
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin"
 *        schema:
 *          type: "object"
 *          properties:
 *            partner:
 *              type: "string"
 *              description: "Đơn vị vận chuyển"
 *              default: 'COD'
 *              enum:
 *                - GHTK
 *                - GHN
 *                - VTP
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
 *            isCOD:
 *              type: "boolean"
 *              description: "Đơn hàng cod hay chuyển khoản"
 *              default: "false"
 *              require: true
 *            shippingPaymentType:
 *              type: "boolean"
 *              description: "true/ shop trả, false/ khách trả"
 *              default: "false"
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
 *            shippingAddress:
 *              type: "string"
 *              description: "địa chỉ mua hàng"
 *              default: "string"
 *              require: true
 *            partnerType:
 *              type: "string"
 *              description: "Đơn vị vc"
 *              default: "string"
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

export default router;
