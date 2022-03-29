import SaleCampaignsController from '@controllers/api/admin/SaleCampaignsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /a/sale_campaigns:
 *   post:
 *     tags:
 *      - "[ADMIN] SALE CAMPAIGN"
 *     summary: Tạo mới chương trình giảm giá
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin chương trình"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *              description: "Tên chương trình"
 *              default: "Tên chương trình"
 *            description:
 *              type: "string"
 *              description: "mô tả"
 *            applicationTarget:
 *              type: "string"
 *              description: "Mô tả ngắn"
 *              enum:
 *                - allProduct
 *                - productCategory
 *                - singleProduct
 *            calculatePriceType:
 *              type: "string"
 *              description: "cách tính giá"
 *              enum:
 *                - reduceByAmount
 *                - reduceByPercent
 *                - increaseByAmount
 *                - increaseByPercent
 *            value:
 *              type: "number"
 *              description: "tham số"
 *              default: "null"
 *            isActive:
 *              type: "boolean"
 *              description: "Trạng thái"
 *              default: false
 *            isApplyToDistributor:
 *              type: "boolean"
 *              description: "Trạng thái"
 *              default: false
 *            isApplyToAgency:
 *              type: "boolean"
 *              description: "Trạng thái"
 *              default: false
 *            isApplyToCollaborator:
 *              type: "boolean"
 *              description: "Trạng thái"
 *              default: false
 *            isApplyToUser:
 *              type: "boolean"
 *              description: "Trạng thái"
 *              default: false
 *            productCategoryId:
 *              type: "string"
 *              description: "Hướng dẫn sử dụng"
 *              default: ""
 *            appliedAt:
 *              type: "date"
 *              description: "ngày bắt đầu"
 *              default: "2022-01-01"
 *            appliedTo:
 *              type: "date"
 *              description: "ngày kết thúc"
 *              default: "2023-01-01"
 *            productVariants:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  productVariantId:
 *                    type: "number"
 *                    description: "id variants"
 *                    default: "null"
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
router.post('/', SaleCampaignsController.create);

/**
 * @openapi
 * /a/sale_campaigns/{saleCampaignId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] SALE CAMPAIGN"
 *     summary: caapj nhaatj chương trình giảm giá
 *     parameters:
 *      - in: "path"
 *        name: "saleCampaignId"
 *        description: "id chương trình"
 *        required: true
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin chương trình"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *              description: "Tên chương trình"
 *              default: "Tên chương trình"
 *            description:
 *              type: "string"
 *              description: "mô tả"
 *            calculatePriceType:
 *              type: "string"
 *              description: "cách tính giá"
 *              enum:
 *                - reduceByAmount
 *                - reduceByPercent
 *                - increaseByAmount
 *                - increaseByPercent
 *            value:
 *              type: "number"
 *              description: "tham số"
 *              default: "null"
 *            isActive:
 *              type: "boolean"
 *              description: "Trạng thái"
 *              default: false
 *            isApplyToDistributor:
 *              type: "boolean"
 *              description: "Trạng thái"
 *              default: false
 *            isApplyToAgency:
 *              type: "boolean"
 *              description: "Trạng thái"
 *              default: false
 *            isApplyToCollaborator:
 *              type: "boolean"
 *              description: "Trạng thái"
 *              default: false
 *            isApplyToUser:
 *              type: "boolean"
 *              description: "Trạng thái"
 *              default: false
 *            productCategoryId:
 *              type: "string"
 *              description: "Hướng dẫn sử dụng"
 *              default: ""
 *            appliedAt:
 *              type: "date"
 *              description: "ngày bắt đầu"
 *              default: "2022-01-01"
 *            appliedTo:
 *              type: "date"
 *              description: "ngày kết thúc"
 *              default: "2023-01-01"
 *            productVariants:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  id:
 *                    type: "number"
 *                    description: "id variants"
 *                    default: "null"
 *                  productVariantId:
 *                    type: "number"
 *                    description: "id variants"
 *                    default: "null"
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
router.patch('/:saleCampaignId', SaleCampaignsController.update);

/**
 * @openapi
 * /a/sale_campaigns/{saleCampaignId}/active:
 *   patch:
 *     tags:
 *      - "[ADMIN] SALE CAMPAIGN"
 *     summary: Thay đổi trạng thái chương trình
 *     parameters:
 *       - in: "path"
 *         name: "saleCampaignId"
 *         description: "id chương trình"
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal error
 *     security:
 *      - Bearer: []
 */

router.patch('/:saleCampaignId/active', SaleCampaignsController.active);

/**
 * @openapi
 * /a/sale_campaigns/{saleCampaignId}:
 *   get:
 *     tags:
 *      - "[ADMIN] SALE CAMPAIGN"
 *     summary: Thông tin chương trình
 *     parameters:
 *       - in: "path"
 *         name: "saleCampaignId"
 *         description: "id chương trình"
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal error
 *     security:
 *      - Bearer: []
 */

router.get('/:saleCampaignId', SaleCampaignsController.show);

/**
 * @openapi
 * /a/sale_campaigns/{saleCampaignId}/inactive:
 *   patch:
 *     tags:
 *      - "[ADMIN] SALE CAMPAIGN"
 *     summary: Thay đổi trạng thái chương trình
 *     parameters:
 *       - in: "path"
 *         name: "saleCampaignId"
 *         description: "id chương trình"
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal error
 *     security:
 *      - Bearer: []
 */

router.patch('/:saleCampaignId/inactive', SaleCampaignsController.inactive);

/**
 * @openapi
 * /a/sale_campaigns/{saleCampaignId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] SALE CAMPAIGN"
 *     summary: xóa chương trình
 *     parameters:
 *       - in: "path"
 *         name: "saleCampaignId"
 *         description: "id chương trình"
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal error
 *     security:
 *      - Bearer: []
 */

router.delete('/:saleCampaignId', SaleCampaignsController.delete);

/**
 * @openapi
 * /a/sale_campaigns:
 *   get:
 *     tags:
 *      - "[ADMIN] SALE CAMPAIGN"
 *     summary: danh sách chương trình
 *     parameters:
 *      - in: "query"
 *        name: "dateFrom"
 *        type: "Date"
 *      - in: "query"
 *        name: "dateTo"
 *        type: "Date"
 *      - in: "query"
 *        name: "freeWord"
 *        type: "string"
 *      - in: "query"
 *        name: "isActive"
 *        type: "boolean"
 *      - in: "query"
 *        name: "sortOrder"
 *        description: "Thứ tự sắp xếp"
 *        type: "string"
 *        enum:
 *          - ASC
 *          - DESC
 *      - in: "query"
 *        name: "sortBy"
 *        type: "string"
 *        description: "Tiêu chí sắp xếp"
 *        enum:
 *          - id
 *          - createdAt
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/',
  SaleCampaignsController.index);

export default router;
