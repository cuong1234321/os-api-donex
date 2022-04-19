import VoucherApplicationController from '@controllers/api/admin/VoucherApplicationsController';
import { withoutSavingUploader } from '@middlewares/uploaders';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/voucher_applications/:
 *   get:
 *     tags:
 *      - "[ADMIN] VOUCHER APPLICATION"
 *     summary: Danh sách voucher
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "string"
 *      - in: "query"
 *        name: "dateFrom"
 *        type: "Date"
 *      - in: "query"
 *        name: "dateTo"
 *        type: "Date"
 *      - in: query
 *        name: "limit"
 *        description: "limit"
 *        type: "string"
 *      - in: query
 *        name: "freeWord"
 *        description: "Từ khóa tìm kiếm"
 *        type: "string"
 *      - in: query
 *        name: "paymentMethod"
 *        description: "Phương thức thanh toán"
 *        type: "string"
 *        enum:
 *          - banking
 *          - vnPay
 *          - COD
 *      - in: query
 *        name: "status"
 *        description: "Trạng thái"
 *        type: "string"
 *        enum:
 *          - active
 *          - inactive
 *     responses:
 *       200:
 *         description: "Success"
 *       500:
 *        description: Internal error
 *     security:
 *      - Bearer: []
 */
router.get('/', VoucherApplicationController.index);

/**
 * @openapi
 * /a/voucher_applications/{voucherApplicationId}:
 *   get:
 *     tags:
 *      - "[ADMIN] VOUCHER APPLICATION"
 *     summary: Xem chi tiết
 *     parameters:
 *      - in: "path"
 *        name: "voucherApplicationId"
 *        required: true
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/:voucherApplicationId', VoucherApplicationController.show);

/**
 * @openapi
 * /a/voucher_applications:
 *   post:
 *     tags:
 *      - "[ADMIN] VOUCHER APPLICATION"
 *     summary: Tạo mới voucher
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin voucher"
 *        schema:
 *          type: "object"
 *          properties:
 *            beneficiaries:
 *              type: "string"
 *              description: "đối tượng áp dụng"
 *              enum:
 *                - user
 *                - collaborator
 *                - agency
 *                - distributor
 *            title:
 *              type: "string"
 *              description: "Tên"
 *            code:
 *              type: "string"
 *              description: "Mã"
 *            appliedAt:
 *              type: "string"
 *              description: "Thời gian sử dụng"
 *            expiredAt:
 *              type: "string"
 *              description: "Thời gian sử dụng"
 *            paymentMethod:
 *              type: "array"
 *              description: "Phương thức thanh toán áp dụng"
 *              items:
 *                type: "string"
 *                enum:
 *                - banking
 *                - vnPAy
 *                - COD
 *            recipientLevel:
 *              type: "string"
 *              description: "cáp bậc áp dụng"
 *              enum:
 *                - all
 *                - tier1
 *                - tier2
 *                - base
 *                - vip
 *            description:
 *              type: "string"
 *              description: "Mô tả"
 *            status:
 *              type: "string"
 *              description: "Trạng thái"
 *              enum:
 *                - active
 *                - inactive
 *            conditions:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  discountValue:
 *                    type: "integer"
 *                    description: "Giảm tối đa"
 *                  orderValue:
 *                    type: "integer"
 *                    description: "Giá trị đơn hàng"
 *                  discountType:
 *                    type: "string"
 *                    description: "Giá trị giảm"
 *                    enum:
 *                      - cash
 *                      - percent
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.post('/', VoucherApplicationController.create);

/**
 * @openapi
 * /a/voucher_applications/{voucherApplicationId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] VOUCHER APPLICATION"
 *     summary: Chỉnh sửa voucher
 *     parameters:
 *      - in: "path"
 *        name: "voucherApplicationId"
 *        required: true
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin voucher"
 *        schema:
 *          type: "object"
 *          properties:
 *            beneficiaries:
 *              type: "string"
 *              description: "đối tượng áp dụng"
 *              enum:
 *                - user
 *                - collaborator
 *                - agency
 *                - distributor
 *            title:
 *              type: "string"
 *              description: "Tên"
 *            code:
 *              type: "string"
 *              description: "Mã"
 *            appliedAt:
 *              type: "string"
 *              description: "Thời gian sử dụng"
 *            expiredAt:
 *              type: "string"
 *              description: "Thời gian sử dụng"
 *            paymentMethod:
 *              type: "array"
 *              description: "Phương thức thanh toán áp dụng"
 *              items:
 *                type: "string"
 *                enum:
 *                - banking
 *                - vnPAy
 *                - COD
 *            recipientLevel:
 *              type: "string"
 *              description: "cáp bậc áp dụng"
 *              enum:
 *                - all
 *                - tier1
 *                - tier2
 *                - base
 *                - vip
 *            description:
 *              type: "string"
 *              description: "Mô tả"
 *            status:
 *              type: "string"
 *              description: "Trạng thái"
 *              enum:
 *                - active
 *                - inactive
 *            conditions:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  discountValue:
 *                    type: "integer"
 *                    description: "Giảm tối đa"
 *                  orderValue:
 *                    type: "integer"
 *                    description: "Giá trị đơn hàng"
 *                  discountType:
 *                    type: "string"
 *                    description: "Giá trị giảm"
 *                    enum:
 *                      - cash
 *                      - percent
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.patch('/:voucherApplicationId', VoucherApplicationController.update);

/**
 * @openapi
 * /a/voucher_applications/{voucherApplicationId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] VOUCHER APPLICATION"
 *     summary: xoa voucher
 *     parameters:
 *      - in: "path"
 *        name: "voucherApplicationId"
 *        required: true
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.delete('/:voucherApplicationId', VoucherApplicationController.delete);

/**
 * @openapi
 * /a/voucher_applications/{voucherApplicationId}/upload_icon:
 *   patch:
 *     tags:
 *      - "[ADMIN] VOUCHER APPLICATION"
 *     summary: Tải lên thumbnail
 *     consumes:
 *      - "multipart/form-data"
 *     produces:
 *      - "application/json"
 *     parameters:
 *      - in: "formData"
 *        name: "file"
 *        description: "File upload"
 *        required: false
 *        allowMultiple: true
 *        type: "file"
 *      - in: "path"
 *        name: "voucherApplicationId"
 *        required: true
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.patch('/:voucherApplicationId/upload_icon',
  withoutSavingUploader.single('file'), VoucherApplicationController.uploadThumbnail);

/**
 * @openapi
 * /a/voucher_applications/{voucherApplicationId}/active:
 *   patch:
 *     tags:
 *      - "[ADMIN] VOUCHER APPLICATION"
 *     summary: Kích hoạt voucher
 *     parameters:
 *      - in: "path"
 *        name: "voucherApplicationId"
 *        required: true
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.patch('/:voucherApplicationId/active', VoucherApplicationController.active);

/**
 * @openapi
 * /a/voucher_applications/{voucherApplicationId}/inactive:
 *   patch:
 *     tags:
 *      - "[ADMIN] VOUCHER APPLICATION"
 *     summary: Hủy kích hoạt voucher
 *     parameters:
 *      - in: "path"
 *        name: "voucherApplicationId"
 *        required: true
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.patch('/:voucherApplicationId/inactive', VoucherApplicationController.inactive);

export default router;
