import { Router } from 'express';
import CollaboratorController from '@controllers/api/collaborator/CollaboratorsController';

const router = Router();

/**
 * @openapi
 * /c/collaborators/:
 *   post:
 *     tags:
 *      - "[COLLABORATOR] Collaborators"
 *     summary: Dang ky CTV/ĐL/NPP
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "thông tin CTV"
 *        schema:
 *          type: "object"
 *          properties:
 *            fullName:
 *              type: "string"
 *            dateOfBirth:
 *              type: "string"
 *              description: "YYYY-MM-DD"
 *            phoneNumber:
 *              type: "string"
 *            email:
 *              type: "string"
 *            provinceId:
 *              type: number
 *            districtId:
 *              type: number
 *            wardId:
 *              type: number
 *            address:
 *              type: "string"
 *            type:
 *              type: "string"
 *              description: "loai"
 *              enum:
 *              - collaborator
 *              - agency
 *            lat:
 *              type: "string"
 *            long:
 *              type: "string"
 *            addressTitle:
 *              type: "string"
 *            paperProofFront:
 *              type: "string"
 *            paperProofBack:
 *              type: "string"
 *            media:
 *              type: "array"
 *              items:
 *                type: "object"
 *                properties:
 *                  source:
 *                    type: "string"
 *                    description: ""
 *                  type:
 *                    type: "string"
 *                    enum:
 *                     - inside
 *                     - outside
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.post('/', CollaboratorController.register);

export default router;
