import { Router } from 'express';
import { adminPassport } from '@middlewares/passport';
import SessionsRouter from './Sessions';
import PasswordRouter from './Passwords';
import ProductRouter from './Products';

const router = Router();

router.use('/sessions', SessionsRouter);
router.use('/passwords', PasswordRouter);
router.use('/products', adminPassport.authenticate('jwt', { session: false }), ProductRouter);

export default router;
