import GhtkController from '@controllers/api/callback/ghnCallBack';
import { Request, Response, Router } from 'express';

const router = Router();

router.post('/update_status', (req: Request, res: Response) => GhtkController.orderStatus(req, res));

export default router;
