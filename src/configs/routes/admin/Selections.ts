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

export default router;
