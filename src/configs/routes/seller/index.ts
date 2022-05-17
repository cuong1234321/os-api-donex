import { Router } from 'express';
import { sellerPassport } from '@middlewares/passport';
import PasswordRouter from './Passwords';
import SessionsRouter from './Sessions';
import ProductRouter from './Products';
import SellerRouter from './Sellers';
import OrderRouter from './Orders';
import SubOrderRouter from './SubOrders';

const router = Router();

router.use('/passwords', PasswordRouter);
router.use('/sessions', SessionsRouter);
router.use('/products', sellerPassport.authenticate('jwt', { session: false }), ProductRouter);
router.use('/sellers', sellerPassport.authenticate('jwt', { session: false }), SellerRouter);
router.use('/orders', sellerPassport.authenticate('jwt', { session: false }), OrderRouter);
router.use('/sub_orders', sellerPassport.authenticate('jwt', { session: false }), SubOrderRouter);

export default router;
