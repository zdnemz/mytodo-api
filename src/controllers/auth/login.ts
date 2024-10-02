import type { Request, Response, NextFunction } from 'express';
import response from '@utils/response';
import validate from '@utils/validate';
import { z } from 'zod';
import User from '@/models/User';
import { password } from 'bun';
import jwt from '@/libs/utils/jwt';
import type { JWTAuthPayload } from '@/types';
import environment from '@/libs/app/environment';

const schemaValidation = z.object({
  identifier: z
    .string({ required_error: 'Email or Username is required.' })
    .min(3, {
      message: 'Email or Username must be at least 3 characters long.',
    }),
  password: z
    .string({ required_error: 'Password is required.' })
    .min(6, { message: 'Password must be at least 6 characters long.' }),
});

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;

    const validated = validate(data, schemaValidation);
    if (!validated) {
      return;
    }

    const user = await User.findOne({
      $or: [
        { email: validated.identifier },
        { username: validated.identifier },
      ],
    }).select('+password');
    if (!user) {
      response(res, { code: 404, message: 'User not found.' });
      return;
    }

    if (!(await password.verify(validated.password, user.password, 'bcrypt'))) {
      response(res, {
        code: 401,
        message: 'Invalid credentials.',
      });
      return;
    }

    const token = jwt.sign({
      id: user.id,
      email: user.email,
    } as JWTAuthPayload);

    res.cookie('accessToken', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
      secure: environment.NODE_ENV === 'production',
      httpOnly: true,
    });

    response(res, {
      code: 200,
      message: 'Login successfully.',
    });
    return;
  } catch (err) {
    next(err as Error);
  }
}

export default login;
