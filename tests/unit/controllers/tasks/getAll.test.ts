import { describe, it, expect, beforeAll, afterAll, mock } from 'bun:test';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import getAll from '../../../../src/controllers/tasks/getAll';
import Task from '../../../../src/models/Task';
import type { NextFunction, Request, Response } from 'express';

const mockUserId = new mongoose.Types.ObjectId();

const mockTasks = [
  {
    title: 'Test Task 1',
    description: 'This is the first test task',
    userId: mockUserId,
    status: 'pending',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    title: 'Test Task 2',
    description: 'This is the second test task',
    userId: mockUserId,
    status: 'completed',
    dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
  },
];

describe('[Unit test] - tasks/getAll - controller', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    await Task.insertMany(mockTasks);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Test case: Successful retrieval of tasks
  it('should return 200 when tasks are retrieved successfully', async () => {
    const request = {
      user: { id: mockUserId }, // Mock user
    } as unknown as Request;
    const response = {
      status: mock().mockReturnThis(),
      json: mock(),
    } as unknown as Response;
    const next: NextFunction = mock();

    await getAll(request, response, next);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 200,
        message: 'Tasks retrieved successfully.',
        data: expect.arrayContaining([
          expect.objectContaining({
            title: 'Test Task 1',
            description: 'This is the first test task',
          }),
          expect.objectContaining({
            title: 'Test Task 2',
            description: 'This is the second test task',
          }),
        ]),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  // Test case: No tasks found for the user
  it('should return 404 with message when no tasks are found', async () => {
    const request = {
      user: { id: new mongoose.Types.ObjectId() }, // Different user ID with no tasks
    } as unknown as Request;
    const response = {
      status: mock().mockReturnThis(),
      json: mock(),
    } as unknown as Response;
    const next: NextFunction = mock();

    await getAll(request, response, next);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 404,
        message: 'No tasks found for this user.',
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
