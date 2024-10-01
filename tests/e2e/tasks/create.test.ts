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

describe('[End-to-end test] - /api/tasks/create', () => {
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
      name: 'Test User', // Include the required `name` field
      birthdate: new Date('2000-01-01'), // Include the required `birthdate` field
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

  it('should create a task successfully with valid data', async () => {
    const taskData = {
      title: 'New Task',
      description: 'Task description',
      status: 'pending',
    };

    const response = await request(server)
      .post('/api/tasks/create')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send(taskData);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: true,
      code: 201,
      message: 'Task has been created successfully.',
      data: expect.any(Object),
    });

    const createdTask = await Task.findOne({ title: 'New Task' });
    expect(createdTask).toBeDefined();
  });

  it('should return 400 when task validation fails (missing title)', async () => {
    const taskData = {
      description: 'Task description',
      status: 'pending',
    };

    const response = await request(server)
      .post('/api/tasks/create')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send(taskData);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: false,
      code: 400,
      message: 'Validation Error',
      data: {
        issues: [expect.stringContaining('Title is required.')],
      },
    });
  });

  it('should return 401 when user is not authenticated', async () => {
    const taskData = {
      title: 'Unauthorized Task',
      description: 'Task description',
      status: 'pending',
    };

    const response = await request(server)
      .post('/api/tasks/create')
      .send(taskData);

    expect(response.statusCode).toEqual(401);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: false,
      code: 401,
      message: 'Invalid Credentials',
    });
  });
});
