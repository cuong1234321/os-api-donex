import { Router } from 'express';
import SessionsRouter from './Sessions';
import AddressBookRouter from './AddressBooks';

const router = Router();
router.use('/sessions', SessionsRouter);
router.use('/address_books', AddressBookRouter);

export default router;
