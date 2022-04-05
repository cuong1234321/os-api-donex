import { Router } from 'express';
import { userPassport } from '@middlewares/passport';
import SessionsRouter from './Sessions';
import AddressBookRouter from './AddressBooks';
import AccountsRouter from './Accounts';
import AuthenticationOtpsRouter from './AuthenticationOtps';
import PasswordRouter from './Passwords';
import ProductRouter from './Products';
import HomepageRouter from './Homepages';
import NewsRouter from './News';
import FavoriteProductRouter from './FavoriteProducts';
import SystemSettingRouter from './SystemSetting';
import NewsCategoryRouter from './NewsCategories';
import UserRouter from './Users';
import CollaboratorRouter from './Collaborators';
import UserNotificationRouter from './UserNotifications';
import UserVoucherRouter from './UserVouchers';
import UploadRouter from './Uploads';

const router = Router();

router.use('/sessions', SessionsRouter);
router.use('/address_books', userPassport.authenticate('jwt', { session: false }), AddressBookRouter);
router.use('/accounts', AccountsRouter);
router.use('/authentication_otps', AuthenticationOtpsRouter);
router.use('/passwords', PasswordRouter);
router.use('/products', ProductRouter);
router.use('/homepages', HomepageRouter);
router.use('/news', NewsRouter);
router.use('/favorite_products', userPassport.authenticate('jwt', { session: false }), FavoriteProductRouter);
router.use('/system_setting', SystemSettingRouter);
router.use('/news_categories', NewsCategoryRouter);
router.use('/users', userPassport.authenticate('jwt', { session: false }), UserRouter);
router.use('/collaborators', CollaboratorRouter);
router.use('/user_notifications', userPassport.authenticate('jwt', { session: false }), UserNotificationRouter);
router.use('/user_vouchers', userPassport.authenticate('jwt', { session: false }), UserVoucherRouter);
router.use('/uploads', UploadRouter);

export default router;
