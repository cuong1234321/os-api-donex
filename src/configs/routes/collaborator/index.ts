import { Router } from 'express';
import CollaboratorRouter from './Collaborators';

const router = Router();

router.use('/collaborators', CollaboratorRouter);

export default router;
