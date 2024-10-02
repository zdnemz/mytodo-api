import type { Request, Response, NextFunction } from 'express';
import response from '@utils/response';
import type { JWTAuthPayload } from '@/types';
import Task from '@/models/Task';

async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as Request & { user: JWTAuthPayload }).user.id;

    const tasks = await Task.find({ userId });
    if (!(tasks.length > 0)) {
      response(res, { code: 404, message: 'No tasks found for this user.' });
      return;
    }

    response(res, {
      code: 200,
      message: 'Tasks retrieved successfully.',
      data: tasks,
    });
    return;
  } catch (err) {
    next(err as Error);
  }
}

export default getAll;
