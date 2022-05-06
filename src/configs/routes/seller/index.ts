import { Router } from 'express';
import PasswordRouter from './Passwords';

const router = Router();

router.use('/passwords', PasswordRouter);

export default router;
