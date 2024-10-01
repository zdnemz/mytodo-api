import create from '@/controllers/tasks/create';
import auth from '@/middlewares/auth';
import { Router } from 'express';

const tasks = Router();

tasks.post('/create', auth, create);

export default tasks;
