import { Router } from 'express';
import VnPayCallbackRouter from './VnPayCallBack';

const router = Router();

router.use('/vnpay', VnPayCallbackRouter);

export default router;
