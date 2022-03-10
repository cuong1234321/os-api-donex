import { Router } from 'express';
import SessionsRouter from './Sessions';
import AddressBookRouter from './AddressBooks';
import AccountsRouter from './Accounts';

const router = Router();

router.use('/sessions', SessionsRouter);
router.use('/address_books', AddressBookRouter);
router.use('/sessions', SessionsRouter);
router.use('/accounts', AccountsRouter);

export default router;
