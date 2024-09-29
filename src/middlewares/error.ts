import { ValidationError } from '@utils/error';
import { logger } from '@utils/logger';
import response from '@utils/response';
import type { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function error(err: Error, _req: Request, res: Response, next: NextFunction) {
  logger.error(err.message, { stack: err.stack });

  if (err instanceof ValidationError) {
    response(res, { code: 400, error: err.issues });
    return;
  }

  response(res, {
    code: 500,
    error: err.message || 'Internal server error',
  });
  return;
}

export default error;
