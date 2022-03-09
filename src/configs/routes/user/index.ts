import { Router } from 'express';
import { userPassport } from '@middlewares/passport';
import SessionsRouter from './Sessions';
import AddressBookRouter from './AddressBooks';
import AccountsRouter from './Accounts';
import AuthenticationOtpsRouter from './AuthenticationOtps';
import PasswordRouter from './Passwords';

const router = Router();

router.use('/sessions', SessionsRouter);
router.use('/address_books', userPassport.authenticate('jwt', { session: false }), AddressBookRouter);
router.use('/accounts', AccountsRouter);
router.use('/authentication_otps', AuthenticationOtpsRouter);
router.use('/passwords', PasswordRouter);

export default router;
