import { Router } from 'express';
import { userPassport } from '@middlewares/passport';
import SessionsRouter from './Sessions';
import AddressBookRouter from './AddressBooks';
import AccountsRouter from './Accounts';
import AuthenticationOtpsRouter from './AuthenticationOtps';
import PasswordRouter from './Passwords';
import ProductRouter from './Products';
import HomepageRouter from './Homepages';
import CollaboratorRouter from './Collaborators';
import NewsRouter from './News';

const router = Router();

router.use('/sessions', SessionsRouter);
router.use('/address_books', userPassport.authenticate('jwt', { session: false }), AddressBookRouter);
router.use('/accounts', AccountsRouter);
router.use('/authentication_otps', AuthenticationOtpsRouter);
router.use('/passwords', PasswordRouter);
router.use('/products', ProductRouter);
router.use('/homepages', HomepageRouter);
router.use('/collaborators', CollaboratorRouter);
router.use('/news', NewsRouter);

export default router;
