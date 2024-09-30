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
import register from '../../../../src/controllers/auth/register';
import { ValidationError } from '../../../../src/libs/utils/error';
import User from '../../../../src/models/User';
import type { NextFunction, Request, Response } from 'express';

describe('[Unit test] - register - controller', () => {
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

  // Test case: Successful registration
  it('should return 201 when user registered successfully', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'StrongPassword1',
      name: 'Test User',
      birthdate: new Date('2000-01-01'),
      gender: 'male',
    };

    const request = {
      body: userData,
    } as Request;
    const response = {
      json: mock(),
      status: mock().mockReturnThis(),
    } as unknown as Response;
    const next: NextFunction = mock();

    await register(request, response, next);

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 201,
        message: 'User has been created successfully.',
      })
    );
    expect(next).not.toHaveBeenCalled();

    const user = await User.findOne({ email: userData.email });
    expect(user).not.toBeNull();
    expect(user?.username).toBe(userData.username);
  });

  // Test case: User already registered
  it('should return 400 when user already registered', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'StrongPassword1',
      name: 'Test User',
      birthdate: new Date('2000-01-01'),
      gender: 'male',
    };

    // Simulate a user already registered
    await User.create(userData);

    const request = {
      body: userData,
    } as Request;
    const response = {
      json: mock(),
      status: mock().mockReturnThis(),
    } as unknown as Response;
    const next: NextFunction = mock();

    await register(request, response, next);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 400,
        message: 'User already registered.',
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  // Test case: Missing required fields
  it('should return 400 when required fields are missing', async () => {
    const userData = {
      username: 'testuser',
      // email is missing
      password: 'StrongPassword1',
      name: 'Test User',
      birthdate: new Date('2000-01-01'),
      gender: 'male',
    };

    const request = {
      body: userData,
    } as Request;
    const response = {
      json: mock(),
      status: mock().mockReturnThis(),
    } as unknown as Response;
    const next: NextFunction = mock();

    await register(request, response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });
});
