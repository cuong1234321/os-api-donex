import ShippingPartnersController from '@controllers/api/collaborator/ShippingPartnersController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /c/shipping_partners/:
 *   get:
 *     tags:
 *      - "[COLLABORATOR] SHIPPING PARTNERS"
 *     summary: danh sach don vi van chuyen
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal errror.
 *     security:
 *      - Bearer: []
 */
router.get('/', ShippingPartnersController.index);

export default router;
