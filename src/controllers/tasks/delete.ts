import type { Request, Response, NextFunction } from 'express';
import response from '@utils/response';
import type { JWTAuthPayload } from '@/types';
import Task from '@/models/Task';
import { isValidObjectId } from 'mongoose';

async function deleteById(req: Request, res: Response, next: NextFunction) {
  try {
    const taskId = req.params.taskId;
    if (!isValidObjectId(taskId)) {
      response(res, { code: 400, message: 'Invalid task id.' });
      return;
    }

    const userId = (req as Request & { user: JWTAuthPayload }).user.id;

    const task = await Task.findOneAndDelete({ _id: taskId, userId });
    if (!task) {
      response(res, {
        code: 404,
        message: 'Task not found to delete.',
      });
      return;
    }

    response(res, {
      code: 200,
      message: 'Task deleted successfully.',
    });
    return;
  } catch (err) {
    next(err as Error);
  }
}

export default deleteById;
