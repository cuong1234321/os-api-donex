import { Router } from 'express';
import VnPayCallbackRouter from './VnPayCallBack';
import GhnCallbackRouter from './GhnCallbacks';

const router = Router();

router.use('/vnpay', VnPayCallbackRouter);
router.use('/ghn', GhnCallbackRouter);

export default router;
