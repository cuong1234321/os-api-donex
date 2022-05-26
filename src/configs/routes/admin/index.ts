import { Router } from 'express';
import { adminPassport } from '@middlewares/passport';
import AdminRouter from './Admins';
import AccountsRouter from './Accounts';
import BannerRouter from './Banners';
import BillTemplateRouter from './BillTemplates';
import BankRoute from './Banks';
import BankAccountRoute from './BankAccounts';
import CollaboratorsRouter from './Collaborators';
import FeeRouter from './Fees';
import HistoryEarnedPointRouter from './HistoryEarnedPoints';
import MarketingNotificationsRouter from './MarketingNotifications';
import NewsCategoryRouter from './NewsCategories';
import NewsRouter from './News';
import OrderRouter from './Orders';
import PopupRouter from './Popups';
import ProductVariantRouter from './ProductVariants';
import ProductCategoryRouter from './ProductCategories';
import ProductRouter from './Products';
import PasswordRouter from './Passwords';
import PermissionGroupRouter from './PermissionGroups';
import PickShiftRouter from './PickShifts';
import RankRouter from './Ranks';
import RoleRouter from './Roles';
import SessionsRouter from './Sessions';
import SelectionRouter from './Selections';
import SaleCampaignRouter from './SaleCampaigns';
import SystemSettingRouter from './SystemSetting';
import ShippingPartnerRouter from './ShippingPartners';
import SubOrderRouter from './SubOrders';
import SellerLevelRouter from './SellerLevels';
import TermRouter from './Terms';
import UserRouter from './Users';
import UploadRouter from './Uploads';
import VoucherApplicationRouter from './VoucherApplications';
import Warehouse from './Warehouses';
import WarehouseReceiptRouter from './WarehouseReceipts';
import WarehouseExportRouter from './WarehouseExports';
import WarehouseTransferRouter from './warehouseTransfers';
import WarehouseReportRouter from './WarehouseReports';

const router = Router();

router.use('/admins', adminPassport.authenticate('jwt', { session: false }), AdminRouter);
router.use('/accounts', adminPassport.authenticate('jwt', { session: false }), adminPassport.authenticate('jwt', { session: false }), AccountsRouter);
router.use('/banners', adminPassport.authenticate('jwt', { session: false }), BannerRouter);
router.use('/bill_templates', adminPassport.authenticate('jwt', { session: false }), BillTemplateRouter);
router.use('/banks', adminPassport.authenticate('jwt', { session: false }), BankRoute);
router.use('/bank_accounts', adminPassport.authenticate('jwt', { session: false }), BankAccountRoute);
router.use('/collaborators', adminPassport.authenticate('jwt', { session: false }), adminPassport.authenticate('jwt', { session: false }), CollaboratorsRouter);
router.use('/fees', adminPassport.authenticate('jwt', { session: false }), FeeRouter);
router.use('/history_earned_points', adminPassport.authenticate('jwt', { session: false }), HistoryEarnedPointRouter);
router.use('/notifications', adminPassport.authenticate('jwt', { session: false }), MarketingNotificationsRouter);
router.use('/news_categories', adminPassport.authenticate('jwt', { session: false }), NewsCategoryRouter);
router.use('/news', adminPassport.authenticate('jwt', { session: false }), NewsRouter);
router.use('/orders', adminPassport.authenticate('jwt', { session: false }), adminPassport.authenticate('jwt', { session: false }), OrderRouter);
router.use('/sub_orders', adminPassport.authenticate('jwt', { session: false }), adminPassport.authenticate('jwt', { session: false }), SubOrderRouter);
router.use('/popups', adminPassport.authenticate('jwt', { session: false }), PopupRouter);
router.use('/variants', adminPassport.authenticate('jwt', { session: false }), ProductVariantRouter);
router.use('/product_categories', adminPassport.authenticate('jwt', { session: false }), ProductCategoryRouter);
router.use('/products', adminPassport.authenticate('jwt', { session: false }), ProductRouter);
router.use('/passwords', PasswordRouter);
router.use('/permission_groups', adminPassport.authenticate('jwt', { session: false }), PermissionGroupRouter);
router.use('/pick_shifts', adminPassport.authenticate('jwt', { session: false }), PickShiftRouter);
router.use('/ranks', adminPassport.authenticate('jwt', { session: false }), RankRouter);
router.use('/roles', adminPassport.authenticate('jwt', { session: false }), RoleRouter);
router.use('/sessions', SessionsRouter);
router.use('/sale_campaigns', adminPassport.authenticate('jwt', { session: false }), SaleCampaignRouter);
router.use('/system_setting', SystemSettingRouter);
router.use('/selections', SelectionRouter);
router.use('/shipping_partners', adminPassport.authenticate('jwt', { session: false }), ShippingPartnerRouter);
router.use('/seller_levels', adminPassport.authenticate('jwt', { session: false }), SellerLevelRouter);
router.use('/terms', adminPassport.authenticate('jwt', { session: false }), TermRouter);
router.use('/users', adminPassport.authenticate('jwt', { session: false }), UserRouter);
router.use('/uploads', adminPassport.authenticate('jwt', { session: false }), UploadRouter);
router.use('/voucher_applications', adminPassport.authenticate('jwt', { session: false }), VoucherApplicationRouter);
router.use('/warehouses', adminPassport.authenticate('jwt', { session: false }), Warehouse);
router.use('/warehouse_receipts', adminPassport.authenticate('jwt', { session: false }), WarehouseReceiptRouter);
router.use('/warehouse_exports', adminPassport.authenticate('jwt', { session: false }), WarehouseExportRouter);
router.use('/warehouse_transfers', adminPassport.authenticate('jwt', { session: false }), WarehouseTransferRouter);
router.use('/warehouse_reports', adminPassport.authenticate('jwt', { session: false }), WarehouseReportRouter);
router.use('/warehouse_transfers', adminPassport.authenticate('jwt', { session: false }), WarehouseTransferRouter);

export default router;
