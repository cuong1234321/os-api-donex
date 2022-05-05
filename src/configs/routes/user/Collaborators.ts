import { Router } from 'express';
import CollaboratorController from '@controllers/api/user/CollaboratorsController';

const router = Router();

/**
 * @openapi
 * /u/collaborators:
 *   get:
 *     tags:
 *      - "[USER] COLLABORATORS"
 *     summary: danh sach cua hang
 *     parameters:
 *      - in: "query"
 *        name: "type"
 *        enum:
 *         - distributor
 *         - agency
 *      - in: "query"
 *        name: "freeWord"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/', CollaboratorController.index);

/**
  * @openapi
  * /u/collaborators/{collaboratorId}:
  *   get:
  *     tags:
  *      - "[USER] COLLABORATORS"
  *     summary: chi tiet cua hang
  *     parameters:
  *      - in: "path"
  *        name: "collaboratorId"
  *     responses:
  *       200:
  *         description: Return data.
  *       500:
  *         description: Lỗi không xác định
  *     security:
  *      - Bearer: []
  */
router.get('/:collaboratorId', CollaboratorController.show);

export default router;
