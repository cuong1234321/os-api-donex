import { Router } from 'express';
import { userPassport } from '@middlewares/passport';
import AddressBookRouter from './AddressBooks';
import AccountsRouter from './Accounts';
import AuthenticationOtpsRouter from './AuthenticationOtps';
import BannerRouter from './Banners';
import CartRouter from './Carts';
import CollaboratorRouter from './Collaborators';
import FeeRouter from './Fees';
import FavoriteProductRouter from './FavoriteProducts';
import HomepageRouter from './Homepages';
import NewsCategoryRouter from './NewsCategories';
import NewsRouter from './News';
import OrderRouter from './Orders';
import PasswordRouter from './Passwords';
import ProductRouter from './Products';
import RatingRouter from './Ratings';
import SystemSettingRouter from './SystemSetting';
import SubOrderRouter from './SubOrders';
import SessionsRouter from './Sessions';
import ShippingPartnerRouter from './ShippingPartners';
import TermRouter from './Terms';
import UserRouter from './Users';
import UserNotificationRouter from './UserNotifications';
import UserVoucherRouter from './Vouchers';
import UploadRouter from './Uploads';

const router = Router();

router.use('/address_books', userPassport.authenticate('jwt', { session: false }), AddressBookRouter);
router.use('/accounts', AccountsRouter);
router.use('/authentication_otps', AuthenticationOtpsRouter);
router.use('/banners', BannerRouter);
router.use('/carts', userPassport.authenticate('jwt', { session: false }), CartRouter);
router.use('/collaborators', CollaboratorRouter);
router.use('/favorite_products', userPassport.authenticate('jwt', { session: false }), FavoriteProductRouter);
router.use('/fees', FeeRouter);
router.use('/homepages', HomepageRouter);
router.use('/news', NewsRouter);
router.use('/news_categories', NewsCategoryRouter);
router.use('/orders', OrderRouter);
router.use('/passwords', PasswordRouter);
router.use('/products', ProductRouter);
router.use('/ratings', RatingRouter);
router.use('/system_setting', SystemSettingRouter);
router.use('/sessions', SessionsRouter);
router.use('/shipping_partners', ShippingPartnerRouter);
router.use('/sub_orders', userPassport.authenticate('jwt', { session: false }), SubOrderRouter);
router.use('/terms', TermRouter);
router.use('/users', userPassport.authenticate('jwt', { session: false }), UserRouter);
router.use('/user_notifications', userPassport.authenticate('jwt', { session: false }), UserNotificationRouter);
router.use('/user_vouchers', userPassport.authenticate('jwt', { session: false }), UserVoucherRouter);
router.use('/uploads', UploadRouter);

export default router;
