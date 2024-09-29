import response from '@utils/response';
import type { Request, Response } from 'express';

function error(err: Error, _req: Request, res: Response) {
  response(res, {
    code: 500,
    error: err.message || 'Internal server error',
  });
}

export default error;
