import SelectionController from '@controllers/api/admin/SelectionController';
import { Router } from 'express';

const router = Router();

/**
  * @openapi
  * /a/selections/provinces:
  *   get:
  *     tags:
  *      - "[ADMIN] SELECTION"
  *     summary: Danh sách tỉnh/thành
  *     responses:
  *       200:
  *         description: Success
  *       500:
  *         description: Internal error
  *     security:
  *      - Bearer: []
 */

router.get('/provinces', SelectionController.provinceSelections);

/**
  * @openapi
  * /a/selections/districts:
  *   get:
  *     tags:
  *      - "[ADMIN] SELECTION"
  *     summary: Danh sách quận/huyện
  *     parameters:
  *       - in: "query"
  *         name: "provinceId"
  *         description: "Mã tỉnh/thành"
  *         required: true
  *     responses:
  *       200:
  *         description: Success
  *       500:
  *         description: Internal error
  *     security:
  *      - Bearer: []
 */

router.get('/districts', SelectionController.districtSelections);

/**
  * @openapi
  * /a/selections/wards:
  *   get:
  *     tags:
  *      - "[ADMIN] SELECTION"
  *     summary: Danh sách phường/xã
  *     parameters:
  *       - in: "query"
  *         name: "districtId"
  *         description: "Mã quận/huyện"
  *         required: true
  *     responses:
  *       200:
  *         description: Success
  *       500:
  *         description: Internal error
  *     security:
  *      - Bearer: []
 */

router.get('/wards', SelectionController.wardSelections);

/**
  * @openapi
  * /a/selections/sizes:
  *   get:
  *     tags:
  *      - "[ADMIN] SELECTION"
  *     summary: Danh sách size
  *     parameters:
  *       - in: "query"
  *         name: "type"
  *         enum:
  *           - shoes
  *           - clothes
  *           - children
  *     responses:
  *       200:
  *         description: Success
  *       500:
  *         description: Internal error
  *     security:
  *      - Bearer: []
 */

router.get('/sizes', SelectionController.sizeSelections);

/**
  * @openapi
  * /a/selections/colors:
  *   get:
  *     tags:
  *      - "[ADMIN] SELECTION"
  *     summary: Danh sách color
  *     responses:
  *       200:
  *         description: Success
  *       500:
  *         description: Internal error
  *     security:
  *      - Bearer: []
 */

router.get('/colors', SelectionController.colorSelections);

/**
 * @openapi
 * /a/selections/product_categories:
 *   get:
 *     tags:
 *      - "[ADMIN] SELECTION"
 *     summary: danh sách danh mục
 *     parameters:
 *      - in: "query"
 *        name: type
 *        description: "Loai danh muc"
 *        enum:
 *         - none
 *         - gender
 *         - collection
 *         - productType
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/product_categories', SelectionController.productCategories);

/**
 * @openapi
 * /a/selections/news_categories:
 *   get:
 *     tags:
 *      - "[ADMIN] SELECTION"
 *     summary: Lấy danh sách danh mục tin tức
 *     parameters:
 *       - in: "query"
 *         name: "freeWord"
 *         description: "freeWord"
 *         type: "string"
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Internal error"
 *     security:
 *      - Bearer: []
 */
router.get('/news_categories', SelectionController.newsCategorySelections);

/**
 * @openapi
 * /a/selections/users:
 *   get:
 *     tags:
 *      - "[ADMIN] SELECTION"
 *     summary: danh sach khach hang
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/users', SelectionController.userSelections);

/**
 * @openapi
 * /a/selections/collaborators:
 *   get:
 *     tags:
 *      - "[ADMIN] SELECTION"
 *     summary: danh sach CTV/DL/NPP
 *     parameters:
 *      - in: "query"
 *        name: type
 *        description: ""
 *        enum:
 *         - collaborator
 *         - agency
 *         - distributor
 *      - in: "query"
 *        name: collaboratorId
 *        description: ""
 *        type: number
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/collaborators', SelectionController.collaboratorSelections);

/**
 * @openapi
 * /a/selections/warehouses:
 *   get:
 *     tags:
 *      - "[ADMIN] SELECTION"
 *     summary: danh sach kho
 *     parameters:
 *      - in: query
 *        name: "status"
 *        description: "status"
 *        type: "string"
 *        enum:
 *          - active
 *          - inactive
 *      - in: query
 *        name: "warehouseId"
 *        description: "warehouseId"
 *        type: "number"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/warehouses', SelectionController.warehouseSelections);

/**
 * @openapi
 * /a/selections/bill_templates:
 *   get:
 *     tags:
 *      - "[ADMIN] SELECTION"
 *     summary: danh sach bill templates
 *     responses:
 *       200:
 *         description: "success"
 *       500:
 *         description: "failed"
 *     security:
 *      - Bearer: []
 */
router.get('/bill_templates', SelectionController.listBillTemplateKeys);

/**
 * @openapi
 * /a/selections/products:
 *   get:
 *     tags:
 *      - "[ADMIN] SELECTION"
 *     summary: danh sach san pham to
 *     parameters:
 *      - in: query
 *        name: "productId"
 *        description: "Ma san pham"
 *        type: "number"
 *      - in: query
 *        name: "name"
 *        description: "ten san pham"
 *        type: "string"
 *      - in: query
 *        name: "warehouseId"
 *        description: "Ma kho"
 *        type: "number"
 *      - in: query
 *        name: "sku"
 *        description: "Ma sku"
 *        type: "number"
 *      - in: query
 *        name: "saleCampaignId"
 *        description: "Ma bang gia"
 *        type: "number"
 *     responses:
 *       200:
 *         description: "success"
 *       500:
 *         description: "failed"
 *     security:
 *      - Bearer: []
 */
router.get('/products', SelectionController.listProducts);

/**
 * @openapi
 * /a/selections/address_books:
 *   get:
 *     tags:
 *      - "[ADMIN] SELECTION"
 *     summary: danh sach so dia chi
 *     parameters:
 *      - in: query
 *        name: "userId"
 *        description: "id khach hang"
 *        type: "number"
 *     responses:
 *       200:
 *         description: "success"
 *       500:
 *         description: "failed"
 *     security:
 *      - Bearer: []
 */
router.get('/address_books', SelectionController.listAddressBooks);

export default router;
