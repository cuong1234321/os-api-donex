import { Router } from 'express';
import CollaboratorRouter from './Collaborators';
import ShippingPartnerRouter from './ShippingPartners';
import FeeRouter from './Fees';

const router = Router();

router.use('/collaborators', CollaboratorRouter);
router.use('/shipping_partners', ShippingPartnerRouter);
router.use('/fees', FeeRouter);

export default router;
