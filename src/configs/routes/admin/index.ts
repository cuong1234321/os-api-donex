import { Router } from 'express';
import SessionsRouter from './Sessions';
import PasswordRouter from './Passwords';
import ProductRouter from './Products';

const router = Router();

router.use('/sessions', SessionsRouter);
router.use('/passwords', PasswordRouter);
router.use('/products', ProductRouter);

export default router;
