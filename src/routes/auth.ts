import login from '@/controllers/auth/login';
import register from '@/controllers/auth/register';
import { Router } from 'express';

const auth = Router();

auth.post('/login', login);
auth.post('/register', register);

export default auth;
