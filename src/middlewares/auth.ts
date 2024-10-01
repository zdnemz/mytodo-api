import type { Response, NextFunction, Request } from 'express';
import { AuthorizedError } from '@utils/error';
import jwt from '@utils/jwt';
import type { JWTAuthPayload } from '@/types';

async function auth(req: Request, _res: Response, next: NextFunction) {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      throw new AuthorizedError('Invalid Credentials');
    }

    const payload = jwt.verify(accessToken);
    if (!payload) {
      throw new AuthorizedError('Invalid Credentials');
    }

    (req as Request & { user: JWTAuthPayload }).user =
      payload as JWTAuthPayload;

    next();
  } catch (err) {
    next(err as Error);
  }
}

export default auth;
