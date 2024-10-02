import type { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import response from './response';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (_req: Request, res: Response) => {
    response(res, {
      code: 429,
      message: 'You have exceeded the request limit. Please try again later.',
    });
  },
});

export default limiter;
