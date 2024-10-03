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

describe('[End-to-end test] - /api/auth/register - POST', () => {
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
  });

  it('should return 201 when user registered successfully', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'StrongPassword1',
      name: 'Test User',
      birthdate: new Date('2000-01-01'),
      gender: 'male',
    };

    const response = await request(server)
      .post('/api/auth/register')
      .send(userData);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: true,
      code: 201,
      message: 'User has been created successfully.',
    });
  });

  it('should return 400 when user already registered', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'StrongPassword1',
      name: 'Test User',
      birthdate: new Date('2000-01-01'),
      gender: 'male',
    };

    await User.create(userData);

    const response = await request(server)
      .post('/api/auth/register')
      .send(userData);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: false,
      code: 400,
      message: 'User already registered.',
    });
  });

  it('should return 400 when required fields are missing', async () => {
    const userData = {
      username: 'testuser',
      // email is missing
      password: 'StrongPassword1',
      name: 'Test User',
      birthdate: new Date('2000-01-01'),
      gender: 'male',
    };

    const response = await request(server)
      .post('/api/auth/register')
      .send(userData);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: false,
      code: 400,
      message: 'Validation error.',
      data: {
        issues: [expect.stringContaining('')],
      },
    });
  });
});
