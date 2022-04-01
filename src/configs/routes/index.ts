import { Router } from 'express';
import AdminRouting from '@configs/routes/admin/index';
import UserRouting from '@configs/routes/user/index';
import CollaboratorRouting from '@configs/routes/collaborator/index';

const router = Router();

router.use('/a', AdminRouting);
router.use('/u', UserRouting);
router.use('/c', CollaboratorRouting);

export default router;
