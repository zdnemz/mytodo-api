import type { Request, Response, NextFunction } from 'express';
import response from '@utils/response';
import { isValidObjectId } from 'mongoose';
import Task from '@/models/Task';
import type { JWTAuthPayload } from '@/types';
import validate from '@/libs/utils/validate';
import { z } from 'zod';

const schemaValidation = z.object({
  title: z
    .string({ required_error: 'Title is required.' })
    .min(3, { message: 'Title must be at least 3 characters long.' })
    .max(100, { message: 'Title must be at most 100 characters long.' })
    .optional(),

  description: z
    .string()
    .max(500, { message: 'Description must be at most 500 characters long.' })
    .optional()
    .nullable(),

  status: z
    .enum(['pending', 'in_progress', 'completed'], {
      message: 'Status must be one of: pending, in_progress, completed.',
    })
    .optional(),

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

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const taskId = req.params.taskId;
    if (!isValidObjectId(taskId)) {
      response(res, { code: 400, message: 'Invalid task id.' });
      return;
    }

    const userId = (req as Request & { user: JWTAuthPayload }).user.id;

    const data = req.body;

    const validated = validate(data, schemaValidation);
    if (!validated) return;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      validated,
      { new: true }
    );
    if (!task) {
      response(res, {
        code: 404,
        message: 'Task not found to update.',
      });
      return;
    }

    response(res, {
      code: 200,
      message: 'Task updated successfully.',
      data: task,
    });
    return;
  } catch (err) {
    next(err as Error);
  }
}

export default update;
