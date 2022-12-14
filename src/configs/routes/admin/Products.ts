import ProductController from '@controllers/api/admin/ProductsController';
import { productZipUploader, withoutSavingUploader } from '@middlewares/uploaders';
import { Request, Response, Router } from 'express';
import Authorization from '@middlewares/authorization';

const router = Router();

/**
 * @openapi
 * /a/products/:
 *   get:
 *     tags:
 *      - "[ADMIN] PRODUCT"
 *     summary: Danh sách sản phẩm
 *     description: Danh sách sản phẩm
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
 *        name: "sku"
 *        description: "ma sku san pham"
 *        type: "string"
 *      - in: query
 *        name: "name"
 *        description: "Ten san pham"
 *        type: "string"
 *      - in: query
 *        name: "category"
 *        description: "Ten danh muc san pham"
 *        type: "string"
 *      - in: query
 *        name: "collectionId"
 *        description: "Ma bo suu tap san pham"
 *        type: "number"
 *      - in: query
 *        name: "unit"
 *        description: "don vi"
 *        type: "string"
 *      - in: query
 *        name: "price"
 *        description: "gia"
 *        type: "number"
 *      - in: query
 *        name: "status"
 *        description: "Trạng thái hiển thị"
 *        type: "string"
 *        enum:
 *          - active
 *          - inactive
 *          - draft
 *      - in: query
 *        name: "skuOrder"
 *        description: "sort"
 *        type: "enum"
 *        enum:
 *          - DESC
 *          - ASC
 *      - in: query
 *        name: "nameOrder"
 *        description: "sort"
 *        type: "enum"
 *        enum:
 *          - DESC
 *          - ASC
 *      - in: query
 *        name: "CategoryOrder"
 *        description: "sort"
 *        type: "enum"
 *        enum:
 *          - DESC
 *          - ASC
 *      - in: query
 *        name: "priceOrder"
 *        description: "sort"
 *        type: "enum"
 *        enum:
 *          - DESC
 *          - ASC
 *      - in: query
 *        name: "statusOrder"
 *        description: "sort"
 *        type: "enum"
 *        enum:
 *          - DESC
 *          - ASC
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
router.get('/', Authorization.permit(ProductController.constructor.name, 'index'), (req: Request, res: Response) => ProductController.index(req, res));

/**
 * @openapi
 * /a/products/list_products:
 *   get:
 *     tags:
 *      - "[ADMIN] PRODUCT"
 *     summary: Danh sách sản phẩm
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
router.get('/list_products', ProductController.listProducts);

/**
 * @openapi
 * /a/products/product_template:
 *   get:
 *     tags:
 *      - "[ADMIN] PRODUCT"
 *     summary: Tải xuống template sản phẩm
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.get('/product_template', ProductController.downloadProductTemplate);

/**
 * @openapi
 * /a/products/{productId}:
 *   get:
 *     tags:
 *      - "[ADMIN] PRODUCT"
 *     summary: Thông tin sản phẩm
 *     parameters:
 *      - in: "path"
 *        name: "productId"
 *        type: "integer"
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
router.get('/:productId', Authorization.permit(ProductController.constructor.name, 'show'), ProductController.show);

/**
 * @openapi
 * /a/products:
 *   post:
 *     tags:
 *      - "[ADMIN] PRODUCT"
 *     summary: Tạo mới product
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin product"
 *        schema:
 *          type: "object"
 *          properties:
 *            name:
 *              type: "string"
 *              description: "Tên sản phẩm"
 *              default: "Tên Sản phẩm"
 *            description:
 *              type: "string"
 *              description: "mô tả"
 *            shortDescription:
 *              type: "string"
 *              description: "Mô tả ngắn"
 *              default: "Mô tả ngắn"
 *            gender:
 *              type: "number"
 *              description: "Giới tính"
 *            typeProductId:
 *              type: "number"
 *              description: "loại sản phẩm"
 *            sizeGuide:
 *              type: "string"
 *              description: "Hướng dẫn sử dụng"
 *              default: ""
 *            unit:
 *              type: "string"
 *              description: "Đơn vị"
 *              default: ""
 *            minStock:
 *              type: "number"
 *              description: "Tồn kho tối thiểu"
 *            maxStock:
 *              type: "number"
 *              description: "Tồn kho tối đa"
 *            weight:
 *              type: "number"
 *              description: "Cân nặng"
 *              default: null
 *            length:
 *              type: "number"
 *              description: "Độ dài"
 *              default: null
 *            width:
 *              type: "number"
 *              description: "Chiều rộng"
 *              default: null
 *            height:
 *              type: "number"
 *              description: "Chiều cao"
 *              default: null
 *            sizeType:
 *              type: "string"
 *              enum:
 *               - clothes
 *               - children
 *               - shoes
 *            index:
 *              type: "number"
 *              description: "thu tu uu tien"
 *            categoryRefs:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  productCategoryId:
 *                    type: "integer"
 *                    description: "Id danh mục"
 *            options:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  key:
 *                    type: "string"
 *                    description: "Tên thuộc tính"
 *                    enum:
 *                      - supportingColor
 *                      - color
 *                      - size
 *                      - form
 *                  value:
 *                    type: "number"
 *                    description: "id thuộc tính"
 *                  optionMappingId:
 *                    type: "number"
 *                    description: "Mã phân loại con tự sinh"
 *                  thumbnail:
 *                    type: "array"
 *                    items:
 *                      type: "object"
 *                      properties:
 *                        source:
 *                          type: string
 *                        type:
 *                          type: string
 *            variants:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  name:
 *                    type: "string"
 *                    description: ""
 *                  buyPrice:
 *                    type: "integer"
 *                    description: "Đơn giá"
 *                  sellPrice:
 *                    type: "integer"
 *                    description: "Đơn giá"
 *                  optionMappingIds:
 *                    type: "array"
 *                    description: "Mã nhóm phân loại"
 *                    items:
 *                      type: "integer"
 *            medias:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  isThumbnail:
 *                    type: "boolean"
 *                    description: "Thumbnail"
 *                  source:
 *                    type: "string"
 *                    default: null
 *                  type:
 *                    type: "string"
 *                    default: null
 *                    enum:
 *                    - image
 *                    - video
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
router.post('/', Authorization.permit(ProductController.constructor.name, 'create,uploadMedia,uploadOptionMedia'), ProductController.create);

/**
 * @openapi
 * /a/products/upload:
 *   post:
 *     tags:
 *      - "[ADMIN] PRODUCT"
 *     summary: Tải lên sản phẩm
 *     consumes:
 *      - "multipart/form-data"
 *     produces:
 *      - "application/json"
 *     parameters:
 *      - in: "formData"
 *        name: "file"
 *        description: "File upload"
 *        required: true
 *        allowMultiple: false
 *        type: "file"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       500:
 *         description: "Upload failed"
 *     security:
 *      - Bearer: []
 */
router.post('/upload', Authorization.permit(ProductController.constructor.name, 'create,uploadMedia,uploadOptionMedia'), productZipUploader.single('file'), ProductController.uploadProducts);

/**
 * @openapi
 * /a/products/{productId}/upload_medias:
 *   post:
 *     tags:
 *      - "[ADMIN] PRODUCT"
 *     summary: Upload media
 *     consumes:
 *      - "multipart/form-data"
 *     produces:
 *      - "application/json"
 *     parameters:
 *      - in: "path"
 *        name: "productId"
 *        type: "integer"
 *      - in: "formData"
 *        name: "Đặt tên biến theo id của product media"
 *        description: "File upload"
 *        required: false
 *        allowMultiple: false
 *        type: "file"
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
router.post('/:productId/upload_medias', Authorization.permit(ProductController.constructor.name, 'create,uploadMedia,uploadOptionMedia'), withoutSavingUploader.any(), ProductController.uploadMedia);

/**
  * @openapi
  * /a/products/{productId}/upload_option_medias:
  *   post:
  *     tags:
  *      - "[ADMIN] PRODUCT"
  *     summary: Upload Option media
  *     description: Tải lên hình ảnh cho phân loại chính.
  *     consumes:
  *      - "multipart/form-data"
  *     produces:
  *      - "application/json"
  *     parameters:
  *      - in: "path"
  *        name: "productId"
  *        type: "integer"
  *      - in: "formData"
  *        name: "Đặt tên biến theo id của product option media"
  *        description: "File upload"
  *        required: false
  *        allowMultiple: false
  *        type: "file"
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
router.post('/:productId/upload_option_medias',
  Authorization.permit(ProductController.constructor.name, 'create,uploadMedia,uploadOptionMedia'),
  withoutSavingUploader.any(), ProductController.uploadOptionMedia);

/**
 * @openapi
 * /a/products/{productId}/active:
 *   patch:
 *     tags:
 *      - "[ADMIN] PRODUCT"
 *     summary: Mo kinh doanh san pham
 *     description: Mo kinh doanh san pham
 *     parameters:
 *      - in: "path"
 *        name: "productId"
 *        type: "integer"
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
router.patch('/:productId/active', Authorization.permit(ProductController.constructor.name, 'update,uploadMedia,uploadOptionMedia,active,inactive'), ProductController.active);

/**
 * @openapi
 * /a/products/{productId}/inactive:
 *   patch:
 *     tags:
 *      - "[ADMIN] PRODUCT"
 *     summary: Ngung kinh doanh san pham
 *     description: Ngung kinh doanh san pham
 *     parameters:
 *      - in: "path"
 *        name: "productId"
 *        type: "integer"
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
router.patch('/:productId/inactive', Authorization.permit(ProductController.constructor.name, 'update,uploadMedia,uploadOptionMedia,active,inactive'), ProductController.inActive);

/**
 * @openapi
 * /a/products/{productId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] PRODUCT"
 *     summary: Xóa product
 *     description: Xóa sản phẩm
 *     parameters:
 *      - in: "path"
 *        name: "productId"
 *        type: "integer"
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
router.delete('/:productId', Authorization.permit(ProductController.constructor.name, 'delete'), ProductController.delete);

/**
 * @openapi
 * /a/products/{productId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] PRODUCT"
 *     summary: Chỉnh sửa sản phẩm
 *     parameters:
 *      - in: "path"
 *        name: "productId"
 *        description: "id sản phẩm"
 *        required: true
 *        type: "number"
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin product"
 *        schema:
 *          type: "object"
 *          properties:
 *            name:
 *              type: "string"
 *              description: "Tên sản phẩm"
 *              default: "Tên Sản phẩm"
 *            description:
 *              type: "string"
 *              description: "mô tả"
 *            shortDescription:
 *              type: "string"
 *              description: "Mô tả ngắn"
 *              default: "Mô tả ngắn"
 *            gender:
 *              type: "number"
 *              description: "Giới tính"
 *            typeProductId:
 *              type: "number"
 *              description: "loại sản phẩm"
 *            sizeGuide:
 *              type: "string"
 *              description: "Hướng dẫn sử dụng"
 *              default: ""
 *            unit:
 *              type: "string"
 *              description: "Đơn vị"
 *              default: ""
 *            minStock:
 *              type: "number"
 *              description: "Tồn kho tối thiểu"
 *            maxStock:
 *              type: "number"
 *              description: "Tồn kho tối đa"
 *            weight:
 *              type: "number"
 *              description: "Cân nặng"
 *              default: null
 *            length:
 *              type: "number"
 *              description: "Độ dài"
 *              default: null
 *            width:
 *              type: "number"
 *              description: "Chiều rộng"
 *              default: null
 *            height:
 *              type: "number"
 *              description: "Chiều cao"
 *              default: null
 *            isHighlight:
 *              type: "boolean"
 *              description: "Noi bat"
 *            isNew:
 *              type: "boolean"
 *              description: ""
 *            inFlashSale:
 *              type: "boolean"
 *              description: ""
 *            sizeType:
 *              type: "string"
 *              enum:
 *               - clothes
 *               - children
 *               - shoes
 *            index:
 *              type: "number"
 *              description: "thu tu uu tien"
 *            categoryRefs:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  productCategoryId:
 *                    type: "integer"
 *                    description: "Id danh mục"
 *            options:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  id:
 *                    type: "number"
 *                    description: "id ooption"
 *                  key:
 *                    type: "string"
 *                    description: "Tên thuộc tính"
 *                    enum:
 *                      - supportingColor
 *                      - color
 *                      - size
 *                      - form
 *                  value:
 *                    type: "number"
 *                    description: "id thuộc tính"
 *                  optionMappingId:
 *                    type: "number"
 *                    description: "Mã phân loại con tự sinh"
 *                  thumbnail:
 *                    type: "array"
 *                    items:
 *                      type: "object"
 *                      properties:
 *                        source:
 *                          type: string
 *                        type:
 *                          type: string
 *            variants:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  id:
 *                    type: "number"
 *                    description: "id variant"
 *                  name:
 *                    type: "string"
 *                    description: ""
 *                  buyPrice:
 *                    type: "integer"
 *                    description: "Đơn giá"
 *                  sellPrice:
 *                    type: "integer"
 *                    description: "Đơn giá"
 *                  optionMappingIds:
 *                    type: "array"
 *                    description: "Mã nhóm phân loại"
 *                    items:
 *                      type: "integer"
 *            medias:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  id:
 *                    type: "number"
 *                    description: "id medias"
 *                  isThumbnail:
 *                    type: "boolean"
 *                    description: "Thumbnail"
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
router.patch('/:productId', Authorization.permit(ProductController.constructor.name, 'update,uploadMedia,uploadOptionMedia,active,inactive'), ProductController.update);

export default router;
