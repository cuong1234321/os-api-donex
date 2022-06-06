import { Router } from 'express';
import { sellerPassport } from '@middlewares/passport';
import AddressRouter from './AddressBooks';
import BankAccountRouter from './BankAccounts';
import FeeRouter from './Fees';
import MoneyWalletChangeRouter from './MoneyWalletChanges';
import PasswordRouter from './Passwords';
import SessionsRouter from './Sessions';
import ProductRouter from './Products';
import SellerRouter from './Sellers';
import OrderRouter from './Orders';
import SubOrderRouter from './SubOrders';
import SellerBankRouter from './SellerBanks';
import SellerNotificationRouter from './SellerNotifications';
import SizeGuideRouter from './SizeGuides';
import TopUpDepositRouter from './TopUpDeposits';
import WithDrawalRequestRouter from './WithdrawalRequests';

const router = Router();

router.use('/address_books', sellerPassport.authenticate('jwt', { session: false }), AddressRouter);
router.use('/bank_accounts', BankAccountRouter);
router.use('/fees', FeeRouter);
router.use('/money_wallet_changes', sellerPassport.authenticate('jwt', { session: false }), MoneyWalletChangeRouter);
router.use('/passwords', PasswordRouter);
router.use('/sessions', SessionsRouter);
router.use('/products', sellerPassport.authenticate('jwt', { session: false }), ProductRouter);
router.use('/sellers', sellerPassport.authenticate('jwt', { session: false }), SellerRouter);
router.use('/orders', sellerPassport.authenticate('jwt', { session: false }), OrderRouter);
router.use('/sub_orders', sellerPassport.authenticate('jwt', { session: false }), SubOrderRouter);
router.use('/size_guides', SizeGuideRouter);
router.use('/seller_banks', sellerPassport.authenticate('jwt', { session: false }), SellerBankRouter);
router.use('/seller_notifications', sellerPassport.authenticate('jwt', { session: false }), SellerNotificationRouter);
router.use('/top_up_deposits', TopUpDepositRouter);
router.use('/withdrawal_requests', sellerPassport.authenticate('jwt', { session: false }), WithDrawalRequestRouter);

export default router;
