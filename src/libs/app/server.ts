import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import limiter from '@utils/limiter';
import router from '@/routes';
import error from '@/middlewares/error';
import morgan from 'morgan';
import { stream } from '@utils/logger';
import environment from './environment';
import cookieParser from 'cookie-parser';
import notFound from '@/middlewares/notFound';

const server = express();

server.use(helmet());
server.use(
  cors({
    origin: environment.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  })
);
server.use(express.json());
server.use(limiter);
server.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream,
  })
);
server.use(cookieParser());

// api endpoint
server.use('/api', router);

// not found handler
server.use(notFound);

// server error handler
server.use(error);

export default server;
