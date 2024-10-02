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
import login from '../../../../src/controllers/auth/login';
import { ValidationError } from '../../../../src/libs/utils/error';
import User from '../../../../src/models/User';
import { password } from 'bun';
import type { NextFunction, Request, Response } from 'express';
import environment from '../../../../src/libs/app/environment';

describe('[Unit test] - auth/login - controller', () => {
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

    // Mock the JWT secret
    environment.JWT_SECRET = 'mocked_secret';
  });

  // Test case: Successful login
  it('should return 200 when user logged in successfully', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'StrongPassword1',
      name: 'Test User',
      birthdate: new Date('2000-01-01'),
      gender: 'male',
    };

    // Create a user with a hashed password
    const hashedPassword = await password.hash(userData.password, 'bcrypt');
    await User.create({ ...userData, password: hashedPassword });

    // Simulate request and response objects
    const request = {
      body: { identifier: userData.email, password: userData.password },
    } as Request;
    const response = {
      cookie: mock(),
      json: mock(),
      status: mock().mockReturnThis(),
    } as unknown as Response;
    const next: NextFunction = mock();

    await login(request, response, next);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 200,
        message: 'Login successfully.',
      })
    );
    expect(response.cookie).toHaveBeenCalledWith(
      'accessToken',
      expect.stringContaining(''),
      expect.objectContaining({
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: expect.any(Boolean),
        httpOnly: true,
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  // Test case: User not found
  it('should return 404 when user is not found', async () => {
    const request = {
      body: { identifier: 'nonexistent@example.com', password: 'wrongPass' },
    } as Request;
    const response = {
      json: mock(),
      status: mock().mockReturnThis(),
    } as unknown as Response;
    const next: NextFunction = mock();

    await login(request, response, next);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 404,
        message: 'User not found.',
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  // Test case: Incorrect password
  it('should return 401 when the password is incorrect', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'StrongPassword1',
      name: 'Test User',
      birthdate: new Date('2000-01-01'),
      gender: 'male',
    };

    const hashedPassword = await password.hash(userData.password, 'bcrypt');
    await User.create({ ...userData, password: hashedPassword });

    const request = {
      body: { identifier: userData.email, password: 'wrongPassword' },
    } as Request;
    const response = {
      json: mock(),
      status: mock().mockReturnThis(),
    } as unknown as Response;
    const next: NextFunction = mock();

    await login(request, response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 401,
        message: 'Invalid credentials.',
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  // Test case: Missing required fields
  it('should return 400 when required fields are missing', async () => {
    const request = {
      body: { identifier: '', password: '' }, // Both fields missing
    } as Request;
    const response = {
      json: mock(),
      status: mock().mockReturnThis(),
    } as unknown as Response;
    const next: NextFunction = mock();

    await login(request, response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });
});
