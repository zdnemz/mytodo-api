import response from '@/libs/utils/response';
import type { Request, Response, NextFunction } from 'express';

function health(_req: Request, res: Response, next: NextFunction) {
  try {
    return response(res, { code: 200, message: 'health ok!' });
  } catch (err) {
    next(err as Error);
  }
}

export default health;
