import { AuthorizedError, ValidationError } from '@utils/error';
import { logger } from '@utils/logger';
import response from '@utils/response';
import type { NextFunction, Request, Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function error(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ValidationError) {
    response(res, { code: 400, message: err.message, error: err.issues });
    return;
  }

  if (err instanceof AuthorizedError || err instanceof TokenExpiredError) {
    response(res, { code: 401, message: err.message });
    return;
  }

  logger.error(err.message, { stack: err.stack });
  response(res, {
    code: 500,
  });
  return;
}

export default error;
