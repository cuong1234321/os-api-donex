import { Router } from 'express';
import PasswordRouter from './Passwords';
import SessionsRouter from './Sessions';
import ProductRouter from './Products';
const router = Router();

router.use('/passwords', PasswordRouter);
router.use('/sessions', SessionsRouter);
router.use('/products', ProductRouter);

export default router;
