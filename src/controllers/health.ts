import response from '@utils/response';
import type { Request, Response, NextFunction } from 'express';

async function health(_req: Request, res: Response, next: NextFunction) {
  try {
    response(res, { code: 200, message: 'health ok!' });
    return;
  } catch (err) {
    next(err as Error);
  }
}

export default health;
