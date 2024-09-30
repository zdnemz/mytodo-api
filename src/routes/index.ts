import health from '@/controllers/health';
import { Router } from 'express';
import auth from './auth';

const router = Router();

router.all('/health', health);
router.use('/auth', auth);

export default router;
