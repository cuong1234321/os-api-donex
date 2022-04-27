import { Router } from 'express';
import CollaboratorRouter from './Collaborators';
import ShippingPartnerRouter from './ShippingPartners';

const router = Router();

router.use('/collaborators', CollaboratorRouter);
router.use('/shipping_partners', ShippingPartnerRouter);

export default router;
