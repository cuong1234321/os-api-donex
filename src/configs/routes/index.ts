import { Router } from 'express';
import AdminRouting from '@configs/routes/admin/index';
import UserRouting from '@configs/routes/user/index';

const router = Router();

router.use('/a', AdminRouting);
router.use('/u', UserRouting);

export default router;
