import { Router } from 'express';
import SessionsRouter from './Sessions';
import PasswordRouter from './Passwords';

const router = Router();

router.use('/sessions', SessionsRouter);
router.use('/passwords', PasswordRouter);

export default router;
