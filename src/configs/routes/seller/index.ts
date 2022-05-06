import { Router } from 'express';
import PasswordRouter from './Passwords';
import SessionsRouter from './Sessions';

const router = Router();

router.use('/passwords', PasswordRouter);
router.use('/sessions', SessionsRouter);

export default router;
