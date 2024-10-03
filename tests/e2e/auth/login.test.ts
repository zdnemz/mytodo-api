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
import User from '../../../src/models/User';
import { password } from 'bun';
import environment from '../../../src/libs/app/environment';

describe('[End-to-end test] - /api/auth/login - POST', () => {
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
    await User.deleteMany({});
    environment.JWT_SECRET = 'mocked_secret';
  });

  // Create a test user for the login tests
  const userData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'StrongPassword1',
    name: 'Test User',
    birthdate: new Date('2000-01-01'),
    gender: 'male',
  };

  beforeEach(async () => {
    await User.create({
      ...userData,
      password: await password.hash(userData.password, 'bcrypt'),
    });
  });

  it('should return 200 when user logged in successfully', async () => {
    const loginData = {
      identifier: 'test@example.com',
      password: 'StrongPassword1',
    };

    const response = await request(server)
      .post('/api/auth/login')
      .send(loginData);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: true,
      code: 200,
      message: 'Login successfully.',
    });
    expect(response.headers['set-cookie']).toBeDefined();

    const cookies = Array.isArray(response.headers['set-cookie'])
      ? response.headers['set-cookie']
      : [response.headers['set-cookie']];
    const accessTokenCookie = cookies.find((cookie) =>
      cookie.startsWith('accessToken=')
    );

    expect(accessTokenCookie).toBeDefined();
  });

  it('should return 401 when login fails due to incorrect password', async () => {
    const loginData = {
      identifier: 'test@example.com',
      password: 'WrongPassword',
    };

    const response = await request(server)
      .post('/api/auth/login')
      .send(loginData);

    expect(response.statusCode).toEqual(401);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: false,
      code: 401,
      message: 'Invalid credentials..',
    });
  });

  it('should return 400 when required fields are missing', async () => {
    const loginData = {
      // identifier is missing
      password: 'StrongPassword1',
    };

    const response = await request(server)
      .post('/api/auth/login')
      .send(loginData);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: false,
      code: 400,
      message: 'Validation error.',
      data: {
        issues: [expect.stringContaining('required')],
      },
    });
  });

  it('should return 400 when email does not exist', async () => {
    const loginData = {
      identifier: 'nonexistent@example.com',
      password: 'StrongPassword1',
    };

    const response = await request(server)
      .post('/api/auth/login')
      .send(loginData);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: false,
      code: 404,
      message: 'User not found.',
    });
  });
});
