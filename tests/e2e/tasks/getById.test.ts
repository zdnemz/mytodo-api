import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from 'bun:test';
import request from 'supertest';
import server from '../../../src/libs/app/server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ObjectId } from 'mongoose';
import Task from '../../../src/models/Task';
import User from '../../../src/models/User';
import { password } from 'bun';
import environment from '../../../src/libs/app/environment';

describe('[End-to-end test] - /api/tasks/:taskId', () => {
  let mongoServer: MongoMemoryServer;
  let accessToken: string;
  let mockTaskId: string;

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
    await User.deleteMany({});
    environment.JWT_SECRET = 'mocked_secret';

    // Create a user for authentication
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: await password.hash('StrongPassword1', 'bcrypt'),
      name: 'Test User',
      birthdate: new Date('2000-01-01'),
    });

    const loginData = {
      identifier: 'test@example.com',
      password: 'StrongPassword1',
    };

    const loginResponse = await request(server)
      .post('/api/auth/login')
      .send(loginData);

    accessToken = loginResponse.headers['set-cookie'][0]
      .split(';')[0]
      .split('=')[1];

    // Create a task for testing retrieval
    const task = await Task.create({
      title: 'Test Task',
      description: 'This is a test task.',
      userId: user._id,
      status: 'pending',
    });

    mockTaskId = (task._id as ObjectId).toString();
  });

  it('should return 200 and retrieve a task successfully when the task exists', async () => {
    const response = await request(server)
      .get(`/api/tasks/${mockTaskId}`)
      .set('Cookie', [`accessToken=${accessToken}`]);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: true,
      code: 200,
      message: 'Tasks retrieved successfully.',
      data: expect.objectContaining({
        _id: mockTaskId,
        title: 'Test Task',
        description: 'This is a test task.',
        status: 'pending',
        userId: expect.any(String), // You can match any string for userId
        createdAt: expect.any(String), // You can match any string for createdAt
        updatedAt: expect.any(String), // You can match any string for updatedAt
      }),
    });
  });

  it('should return 404 when task is not found by ID', async () => {
    const nonExistentTaskId = new mongoose.Types.ObjectId();

    const response = await request(server)
      .get(`/api/tasks/${nonExistentTaskId}`)
      .set('Cookie', [`accessToken=${accessToken}`]);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: false,
      code: 404,
      message: 'Task is not found by the id.',
    });
  });

  it('should return 401 when user is not authenticated', async () => {
    const response = await request(server).get('/api/tasks/');

    expect(response.statusCode).toEqual(401);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: false,
      code: 401,
      message: 'Invalid Credentials',
    });
  });
});
