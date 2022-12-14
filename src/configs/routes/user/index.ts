import { Router } from 'express';
import { userPassport } from '@middlewares/passport';
import AddressBookRouter from './AddressBooks';
import AccountsRouter from './Accounts';
import AuthenticationOtpsRouter from './AuthenticationOtps';
import BankAccountRouter from './BankAccounts';
import BannerRouter from './Banners';
import CartRouter from './Carts';
import CollaboratorRouter from './Collaborators';
import CoinWalletChangeRouter from './CoinWalletChanges';
import FeeRouter from './Fees';
import FavoriteProductRouter from './FavoriteProducts';
import HomepageRouter from './Homepages';
import HistoryEarnedPointRouter from './HistoryEarnedPoints';
import NewsCategoryRouter from './NewsCategories';
import NewsRouter from './News';
import LookBookRouter from './LookBooks';
import OrderRouter from './Orders';
import PasswordRouter from './Passwords';
import PopupRouter from './Popups';
import ProductRouter from './Products';
import RatingRouter from './Ratings';
import RankRouter from './Ranks';
import SystemSettingRouter from './SystemSetting';
import SubOrderRouter from './SubOrders';
import SessionsRouter from './Sessions';
import SizeGuideRouter from './SizeGuides';
import TermRouter from './Terms';
import UserRouter from './Users';
import UserNotificationRouter from './UserNotifications';
import UserVoucherRouter from './Vouchers';
import UploadRouter from './Uploads';
import OrderFeedbackRouter from './OrderFeedbacks';

const router = Router();

router.use('/address_books', userPassport.authenticate('jwt', { session: false }), AddressBookRouter);
router.use('/accounts', AccountsRouter);
router.use('/authentication_otps', AuthenticationOtpsRouter);
router.use('/banners', BannerRouter);
router.use('/bank_accounts', BankAccountRouter);
router.use('/carts', CartRouter);
router.use('/collaborators', CollaboratorRouter);
router.use('/coin_wallet_changes', userPassport.authenticate('jwt', { session: false }), CoinWalletChangeRouter);
router.use('/favorite_products', userPassport.authenticate('jwt', { session: false }), FavoriteProductRouter);
router.use('/fees', FeeRouter);
router.use('/homepages', HomepageRouter);
router.use('/history_earned_points', userPassport.authenticate('jwt', { session: false }), HistoryEarnedPointRouter);
router.use('/news', NewsRouter);
router.use('/news_categories', NewsCategoryRouter);
router.use('/look_books', LookBookRouter);
router.use('/orders', OrderRouter);
router.use('/order_feedbacks', userPassport.authenticate('jwt', { session: false }), OrderFeedbackRouter);
router.use('/passwords', PasswordRouter);
router.use('/popups', PopupRouter);
router.use('/products', ProductRouter);
router.use('/ratings', RatingRouter);
router.use('/ranks', RankRouter);
router.use('/system_setting', SystemSettingRouter);
router.use('/sessions', SessionsRouter);
router.use('/sub_orders', userPassport.authenticate('jwt', { session: false }), SubOrderRouter);
router.use('/size_guides', SizeGuideRouter);
router.use('/terms', TermRouter);
router.use('/users', userPassport.authenticate('jwt', { session: false }), UserRouter);
router.use('/user_notifications', userPassport.authenticate('jwt', { session: false }), UserNotificationRouter);
router.use('/user_vouchers', userPassport.authenticate('jwt', { session: false }), UserVoucherRouter);
router.use('/uploads', UploadRouter);

export default router;
