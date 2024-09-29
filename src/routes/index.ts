import health from '@/controllers/health';
import { Router } from 'express';

const router = Router();

router.all('/health', health);

export default router;
