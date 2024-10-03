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
import mongoose from 'mongoose';
import Task from '../../../src/models/Task';
import User from '../../../src/models/User';
import { password } from 'bun';
import environment from '../../../src/libs/app/environment';

describe('[End-to-end test] - /api/tasks/ - GET', () => {
  let mongoServer: MongoMemoryServer;
  let accessToken: string;

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

    await User.create({
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
  });

  it('should return 200 and retrieve tasks successfully when tasks exist', async () => {
    // Pre-create tasks for the test user
    await Task.create([
      {
        title: 'Test Task 1',
        description: 'Task description 1',
        userId: (await User.findOne({ email: 'test@example.com' }))!._id,
        status: 'pending',
      },
      {
        title: 'Test Task 2',
        description: 'Task description 2',
        userId: (await User.findOne({ email: 'test@example.com' }))!._id,
        status: 'completed',
      },
    ]);

    const response = await request(server)
      .get('/api/tasks/')
      .set('Cookie', [`accessToken=${accessToken}`]);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: true,
      code: 200,
      message: 'Tasks retrieved successfully.',
      data: expect.arrayContaining([
        expect.objectContaining({
          title: 'Test Task 1',
          description: 'Task description 1',
          status: 'pending',
        }),
        expect.objectContaining({
          title: 'Test Task 2',
          description: 'Task description 2',
          status: 'completed',
        }),
      ]),
    });
  });

  it('should return 404 and no tasks when user has no tasks', async () => {
    const response = await request(server)
      .get('/api/tasks/')
      .set('Cookie', [`accessToken=${accessToken}`]);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: false,
      code: 404,
      message: 'No tasks found for this user.',
    });
  });

  it('should return 401 when user is not authenticated', async () => {
    const response = await request(server).get('/api/tasks/');

    expect(response.statusCode).toEqual(401);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: false,
      code: 401,
      message: 'Invalid credentials.',
    });
  });
});
