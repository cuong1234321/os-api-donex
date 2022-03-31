import { Router } from 'express';
import SessionsRouter from './Sessions';
import PasswordRouter from './Passwords';
import ProductRouter from './Products';
import CollaboratorsRouter from './Collaborators';
import UserRouter from './Users';
import ProductCategoryRouter from './ProductCategories';
import NewsRouter from './News';
import SelectionRouter from './Selections';
import SaleCampaignRouter from './SaleCampaigns';
import SystemSettingRouter from './SystemSetting';
import AdminRouter from './Admins';
import PopupRouter from './Popups';
import MarketingNotificationsRouter from './MarketingNotifications';

const router = Router();

router.use('/sessions', SessionsRouter);
router.use('/passwords', PasswordRouter);
router.use('/products', ProductRouter);
router.use('/collaborators', CollaboratorsRouter);
router.use('/users', UserRouter);
router.use('/product_categories', ProductCategoryRouter);
router.use('/news', NewsRouter);
router.use('/selections', SelectionRouter);
router.use('/sale_campaigns', SaleCampaignRouter);
router.use('/system_setting', SystemSettingRouter);
router.use('/admins', AdminRouter);
router.use('/popups', PopupRouter);
router.use('/notifications', MarketingNotificationsRouter);

export default router;
