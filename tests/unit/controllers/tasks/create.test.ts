import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  mock,
} from 'bun:test';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import create from '../../../../src/controllers/tasks/create';
import Task from '../../../../src/models/Task';
import type { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../../../../src/libs/utils/error';

const mockUserId = new mongoose.Types.ObjectId();

describe('[Unit test] - create - controller', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  // Test case: Successful task creation
  it('should return 201 when task is created successfully', async () => {
    const requestBody = {
      title: 'Test Task',
      description: 'This is a test task description',
      status: 'pending',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day in the future
    };

    const request = {
      body: requestBody,
      user: { id: mockUserId }, // Mock user
    } as unknown as Request;
    const response = {
      status: mock().mockReturnThis(),
      json: mock(),
    } as unknown as Response;
    const next: NextFunction = mock();

    await create(request, response, next);

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 201,
        message: 'Task has been created successfully.',
        data: expect.objectContaining(requestBody),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  // Test case: Missing title field
  it('should return 400 when title is missing', async () => {
    const requestBody = {
      description: 'Missing title',
      status: 'pending',
    };

    const request = {
      body: requestBody,
      user: { id: mockUserId },
    } as unknown as Request;
    const response = {
      status: mock().mockReturnThis(),
      json: mock(),
    } as unknown as Response;
    const next: NextFunction = mock();

    await create(request, response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  // Test case: Invalid due date (past date)
  it('should return 400 when due date is in the past', async () => {
    const requestBody = {
      title: 'Test Task',
      description: 'This is a test task description',
      status: 'pending',
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day in the past
    };

    const request = {
      body: requestBody,
      user: { id: mockUserId },
    } as unknown as Request;
    const response = {
      status: mock().mockReturnThis(),
      json: mock(),
    } as unknown as Response;
    const next: NextFunction = mock();

    await create(request, response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  // Test case: Invalid status value
  it('should return 400 when status is invalid', async () => {
    const requestBody = {
      title: 'Test Task',
      description: 'This is a test task description',
      status: 'invalid_status', // Invalid status
    };

    const request = {
      body: requestBody,
      user: { id: mockUserId },
    } as unknown as Request;
    const response = {
      status: mock().mockReturnThis(),
      json: mock(),
    } as unknown as Response;
    const next: NextFunction = mock();

    await create(request, response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });
});
