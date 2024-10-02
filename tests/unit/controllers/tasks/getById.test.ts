import { describe, it, expect, beforeAll, afterAll, mock } from 'bun:test';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import getById from '../../../../src/controllers/tasks/getById';
import Task from '../../../../src/models/Task';
import type { NextFunction, Request, Response } from 'express';

const mockUserId = new mongoose.Types.ObjectId();

const mockTask = {
  title: 'Test Task',
  description: 'This is a test task description',
  userId: mockUserId,
  status: 'pending',
  dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day in the future
};

describe('[Unit test] - tasks/getById - controller', () => {
  let mongoServer: MongoMemoryServer;
  let mockTaskId: unknown;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    const task = await Task.create(mockTask);

    mockTaskId = task._id;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Test case: Successful task creation
  it('should return 200 when task is retrieved successfully', async () => {
    const request = {
      params: {
        taskId: mockTaskId,
      },
      user: { id: mockUserId }, // Mock user
    } as unknown as Request;
    const response = {
      status: mock().mockReturnThis(),
      json: mock(),
    } as unknown as Response;
    const next: NextFunction = mock();

    await getById(request, response, next);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 200,
        message: 'Tasks retrieved successfully.',
        data: expect.objectContaining(mockTask),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  // Test case: missing task id
  it('should return 400 when task id is missing', async () => {
    const request = {
      params: {
        taskId: undefined,
      },
      user: { id: mockUserId },
    } as unknown as Request;
    const response = {
      status: mock().mockReturnThis(),
      json: mock(),
    } as unknown as Response;
    const next: NextFunction = mock();

    await getById(request, response, next);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 400,
        message: 'Missing task id.',
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  // Test case: not found task
  it('should return 404 when task is not found', async () => {
    const request = {
      params: {
        taskId: new mongoose.Types.ObjectId(),
      },
      user: { id: mockUserId },
    } as unknown as Request;
    const response = {
      status: mock().mockReturnThis(),
      json: mock(),
    } as unknown as Response;
    const next: NextFunction = mock();

    await getById(request, response, next);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 404,
        message: 'Task is not found by the id.',
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
