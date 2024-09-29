import { logger } from '@/libs/utils/logger';
import response from '@utils/response';
import type { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function error(err: Error, _req: Request, res: Response, next: NextFunction) {
  logger.error(err.message, { stack: err.stack });

  response(res, {
    code: 500,
    error: err.message || 'Internal server error',
  });
}

export default error;
