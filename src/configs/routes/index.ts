import { Router } from 'express';
import AdminRouting from '@configs/routes/admin/index';
import UserRouting from '@configs/routes/user/index';
import CollaboratorRouting from '@configs/routes/collaborator/index';
import SellerRouting from '@configs/routes/seller/index';

const router = Router();

router.use('/a', AdminRouting);
router.use('/u', UserRouting);
router.use('/c', CollaboratorRouting);
router.use('/s', SellerRouting);

export default router;
