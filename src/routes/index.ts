import health from '@/controllers/health';
import { Router } from 'express';
import auth from './auth';
import tasks from './tasks';

const router = Router();

router.all('/health', health);
router.use('/auth', auth);
router.use('/tasks', tasks);

export default router;
