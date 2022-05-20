import VnPayCallBackController from '@controllers/api/callback/VnPayCallBackController';
import { Request, Response, Router } from 'express';

const router = Router();

router.get('/payment_confirm', (req: Request, res: Response) => VnPayCallBackController.paymentConfirmCallback(req, res));
router.get('/payment_redirect', VnPayCallBackController.paymentConfirmRedirect);

export default router;
