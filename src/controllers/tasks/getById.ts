import type { Request, Response, NextFunction } from 'express';
import response from '@utils/response';
import type { JWTAuthPayload } from '@/types';
import Task from '@/models/Task';

async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const taskId = req.params.taskId;
    if (!taskId) {
      response(res, { code: 400, message: 'Missing task id.' });
      return;
    }

    const userId = (req as Request & { user: JWTAuthPayload }).user.id;

    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      response(res, { code: 404, message: 'Task is not found by the id.' });
      return;
    }

    response(res, {
      code: 200,
      message: 'Tasks retrieved successfully.',
      data: task,
    });
    return;
  } catch (err) {
    next(err as Error);
  }
}

export default getById;
