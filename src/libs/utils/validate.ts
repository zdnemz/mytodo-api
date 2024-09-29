import { ZodError, ZodSchema } from 'zod';
import { ValidationError } from './error';

function validate<T>(data: T, schema: ZodSchema<T>): T {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError(err.issues.map((issue) => issue.message));
    }
    throw err;
  }
}

export default validate;
