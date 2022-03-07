import { Router } from 'express';
import SessionsRouter from './Sessions';

const router = Router();

router.use('/sessions', SessionsRouter);

export default router;
