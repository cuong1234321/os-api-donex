import AddressBookController from '@controllers/api/seller/AddressBooksController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /s/address_books:
 *   get:
 *     tags:
 *      - "[SELLER] ADDRESS BOOKS"
 *     summary: Danh sách sổ địa chỉ
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal errror.
 *     security:
 *      - Bearer: []
 */
router.get('/', AddressBookController.index);

/**
 * @openapi
 * /s/address_books/{addressBookId}:
 *   get:
 *     tags:
 *      - "[SELLER] ADDRESS BOOKS"
 *     summary: Xem chi tiết sổ địa chỉ
 *     parameters:
 *      - in: "path"
 *        name: "addressBookId"
 *        required: true
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal errror.
 *     security:
 *      - Bearer: []
 */
router.get('/:addressBookId', AddressBookController.show);

/**
 * @openapi
 * /s/address_books:
 *   post:
 *     tags:
 *      - "[SELLER] ADDRESS BOOKS"
 *     summary: Thêm mới sổ địa chỉ
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        schema:
 *          type: "object"
 *          properties:
 *            phoneNumber:
 *              type: "string"
 *              description: "Số điện thoại"
 *            fullName:
 *              type: "string"
 *              description: "họ và tên"
 *            address:
 *              type: "string"
 *              description: "địa chỉ cụ thể"
 *            provinceId:
 *              type: "string"
 *              description: "id tỉnh/thành phố"
 *            districtId:
 *              type: "string"
 *              description: "id quận huyện"
 *            wardId:
 *              type: "string"
 *              description: "id phường xã"
 *            isDefault:
 *              type: "boolean"
 *              description: "đặt làm địa chỉ mặc định"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal errror.
 *     security:
 *      - Bearer: []
 */
router.post('/', AddressBookController.create);

/**
 * @openapi
 * /s/address_books/{addressBookId}:
 *   patch:
 *     tags:
 *      - "[SELLER] ADDRESS BOOKS"
 *     summary: Sửa sổ địa chỉ
 *     parameters:
 *      - in: "path"
 *        name: "addressBookId"
 *        required: true
 *      - in: "body"
 *        name: "body"
 *        schema:
 *          type: "object"
 *          properties:
 *            phoneNumber:
 *              type: "string"
 *              description: "Số điện thoại"
 *            fullName:
 *              type: "string"
 *              description: "họ và tên"
 *            address:
 *              type: "string"
 *              description: "địa chỉ cụ thể"
 *            provinceId:
 *              type: "string"
 *              description: "id tỉnh/thành phố"
 *            districtId:
 *              type: "string"
 *              description: "id quận huyện"
 *            wardId:
 *              type: "string"
 *              description: "id phường xã"
 *            isDefault:
 *              type: "boolean"
 *              description: "đặt làm địa chỉ mặc định"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal errror.
 *     security:
 *      - Bearer: []
 */
router.patch('/:addressBookId', AddressBookController.update);

/**
 * @openapi
 * /s/address_books/{addressBookId}:
 *   delete:
 *     tags:
 *      - "[SELLER] ADDRESS BOOKS"
 *     summary: Xoá sổ địa chỉ
 *     parameters:
 *      - in: "path"
 *        name: "addressBookId"
 *        required: true
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal errror.
 *     security:
 *      - Bearer: []
 */
router.delete('/:addressBookId', AddressBookController.delete);

export default router;
