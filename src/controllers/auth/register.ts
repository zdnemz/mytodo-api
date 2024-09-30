import type { Request, Response, NextFunction } from 'express';
import response from '@utils/response';
import { z } from 'zod';
import validate from '@utils/validate';
import User from '@/models/User';
import { password } from 'bun';
import { logger } from '@utils/logger';

const schemaValidation = z.object({
  username: z
    .string({ required_error: 'Username is required.' })
    .min(3, { message: 'Username must be at least 3 characters long.' })
    .max(20, { message: 'Username must be at most 20 characters long.' }),
  email: z
    .string({ required_error: 'Email is required.' })
    .email({ message: 'Invalid email address.' }),
  password: z
    .string({ required_error: 'Password is required.' })
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .regex(/(?=.*[A-Z])/, {
      message: 'Password must contain at least one uppercase letter.',
    }),
  name: z
    .string({ required_error: 'Name is required.' })
    .max(50, { message: 'Name must be at most 50 characters long.' }),
  birthdate: z.coerce.date({
    required_error: 'Birthdate is required.',
    invalid_type_error: 'Invalid date.',
  }),
  gender: z.enum(['male', 'female', 'unknown'], {
    required_error: 'Gender is required.',
  }),
});

async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;

    const validated = validate(data, schemaValidation);
    if (!validated) {
      return;
    }

    const user = await User.findOne({
      $or: [{ email: validated.email }, { username: validated.username }],
    });
    if (user) {
      response(res, { code: 400, message: 'User already registered.' });
      return;
    }

    const hashedPassword = await password.hash(validated.password, 'bcrypt');
    const newUser = await User.create({
      ...validated,
      password: hashedPassword,
    });

    logger.info(`User [${newUser.id}] has been created.`);

    response(res, {
      code: 201,
      message: 'User has been created successfully.',
    });
    return;
  } catch (err) {
    next(err as Error);
  }
}

export default register;
