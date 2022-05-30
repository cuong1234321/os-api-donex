import { Router } from 'express';
import CollaboratorRouter from './Collaborators';
import FeeRouter from './Fees';

const router = Router();

router.use('/collaborators', CollaboratorRouter);
router.use('/fees', FeeRouter);

export default router;
