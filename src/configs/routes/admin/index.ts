import { Router } from 'express';
import { adminPassport } from '@middlewares/passport';
import SessionsRouter from './Sessions';
import PasswordRouter from './Passwords';
import ProductRouter from './Products';
import CollaboratorsRouter from './Collaborators';

const router = Router();

router.use('/sessions', SessionsRouter);
router.use('/passwords', PasswordRouter);
router.use('/products', adminPassport.authenticate('jwt', { session: false }), ProductRouter);
router.use('/collaborators', adminPassport.authenticate('jwt', { session: false }), CollaboratorsRouter);

export default router;
