import type { Response, NextFunction, Request } from 'express';
import response from '@utils/response';
import type { JWTAuthPayload } from '@/types';
import { z } from 'zod';
import validate from '@utils/validate';
import Task from '@/models/Task';

const schemaValidation = z.object({
  title: z
    .string({ required_error: 'Title is required.' })
    .min(3, { message: 'Title must be at least 3 characters long.' })
    .max(100, { message: 'Title must be at most 100 characters long.' })
    .nonempty({ message: 'Title cannot be empty.' }),

  description: z
    .string()
    .max(500, { message: 'Description must be at most 500 characters long.' })
    .optional()
    .nullable(),

  status: z.enum(['pending', 'in_progress', 'completed'], {
    required_error: 'Status is required.',
  }),

  dueDate: z.coerce
    .date()
    .nullable()
    .optional()
    .refine(
      (date) => {
        if (date) {
          return new Date(date) >= new Date();
        }
        return true;
      },
      { message: 'Due date must be in the future.' }
    ),
});

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;

    const validated = validate(data, schemaValidation);
    if (!validated) return;

    const userId = (req as Request & { user: JWTAuthPayload }).user.id;

    const newTask = await Task.create({ ...validated, userId });

    response(res, {
      code: 201,
      message: 'Task has been created successfully.',
      data: newTask,
    });
    return;
  } catch (err) {
    next(err as Error);
  }
}

export default create;
