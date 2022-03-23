import { Router } from 'express';
import SessionsRouter from './Sessions';
import PasswordRouter from './Passwords';
import ProductRouter from './Products';
import CollaboratorsRouter from './Collaborators';
import UserRouter from './Users';
import ProductCategoryRouter from './ProductCategories';
import NewsRouter from './News';
import SelectionRouter from './Selections';
import AdminRouter from './Admins';

const router = Router();

router.use('/sessions', SessionsRouter);
router.use('/passwords', PasswordRouter);
router.use('/products', ProductRouter);
router.use('/collaborators', CollaboratorsRouter);
router.use('/users', UserRouter);
router.use('/product_categories', ProductCategoryRouter);
router.use('/news', NewsRouter);
router.use('/selections', SelectionRouter);
router.use('/admins', AdminRouter);

export default router;
