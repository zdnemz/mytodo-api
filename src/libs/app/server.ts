import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import limiter from '@utils/limiter';
import router from '@/routes';
import response from '@utils/response';
import error from '@/middlewares/error';

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(limiter);

server.use('/api', router);

server.use('*', function (_req, res) {
  response(res, { code: 404 });
});

server.use(error);

export default server;
