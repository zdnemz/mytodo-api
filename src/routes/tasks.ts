import create from '@/controllers/tasks/create';
import deleteById from '@/controllers/tasks/delete';
import getAll from '@/controllers/tasks/getAll';
import getById from '@/controllers/tasks/getById';
import auth from '@/middlewares/auth';
import { Router } from 'express';

const tasks = Router();

tasks.post('/create', auth, create);
tasks.get('/', auth, getAll);
tasks.get('/:taskId', auth, getById);
tasks.delete('/:taskId', auth, deleteById);

export default tasks;
