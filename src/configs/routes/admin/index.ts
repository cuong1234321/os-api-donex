import { Router } from 'express';
import { adminPassport } from '@middlewares/passport';
import AdminRouter from './Admins';
import AccountsRouter from './Accounts';
import BannerRouter from './Banners';
import BillTemplateRouter from './BillTemplates';
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
import PermissionGroups from './PermissionGroups';
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

router.use('/admins', AdminRouter);
router.use('/accounts', adminPassport.authenticate('jwt', { session: false }), AccountsRouter);
router.use('/banners', BannerRouter);
router.use('/bill_templates', BillTemplateRouter);
router.use('/collaborators', adminPassport.authenticate('jwt', { session: false }), CollaboratorsRouter);
router.use('/fees', FeeRouter);
router.use('/history_earned_points', HistoryEarnedPointRouter);
router.use('/notifications', MarketingNotificationsRouter);
router.use('/news_categories', NewsCategoryRouter);
router.use('/news', NewsRouter);
router.use('/orders', adminPassport.authenticate('jwt', { session: false }), OrderRouter);
router.use('/sub_orders', adminPassport.authenticate('jwt', { session: false }), SubOrderRouter);
router.use('/popups', PopupRouter);
router.use('/variants', ProductVariantRouter);
router.use('/product_categories', ProductCategoryRouter);
router.use('/products', ProductRouter);
router.use('/passwords', PasswordRouter);
router.use('/permission_groups', PermissionGroups);
router.use('/ranks', RankRouter);
router.use('/roles', RoleRouter);
router.use('/sessions', SessionsRouter);
router.use('/sale_campaigns', SaleCampaignRouter);
router.use('/system_setting', SystemSettingRouter);
router.use('/selections', SelectionRouter);
router.use('/shipping_partners', ShippingPartnerRouter);
router.use('/seller_levels', SellerLevelRouter);
router.use('/terms', TermRouter);
router.use('/users', UserRouter);
router.use('/uploads', UploadRouter);
router.use('/voucher_applications', VoucherApplicationRouter);
router.use('/warehouses', Warehouse);
router.use('/warehouse_receipts', WarehouseReceiptRouter);
router.use('/warehouse_exports', WarehouseExportRouter);
router.use('/warehouse_transfers', WarehouseTransferRouter);
router.use('/warehouse_reports', WarehouseReportRouter);
router.use('/warehouse_transfers', WarehouseTransferRouter);

export default router;
