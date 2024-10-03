import type { Request, Response, NextFunction } from 'express';
import response from '@utils/response';

async function notFound(_req: Request, res: Response, next: NextFunction) {
  try {
    response(res, { code: 404, message: 'Not found.' });
    return;
  } catch (err) {
    next(err as Error);
  }
}

export default notFound;
