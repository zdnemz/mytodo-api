import { describe, it, expect, mock } from 'bun:test';
import auth from '../../../src/middlewares/auth';
import type { Request, Response, NextFunction } from 'express';
import { AuthorizedError } from '../../../src/libs/utils/error';
import jwt from '../../../src/libs/utils/jwt';
import type { JWTAuthPayload } from '../../../src/types';

describe('[Unit test] - auth - middleware', () => {
  it('should set user in request and call next if token is valid', async () => {
    const payload: JWTAuthPayload = { id: '123', email: 'test@example.com' };

    // Mocking jwt.verify to return a valid payload
    jwt.verify = mock().mockReturnValue(payload);

    const request = {
      cookies: {
        accessToken: 'valid_token',
      },
    } as unknown as Request;

    const response = {} as Response;
    const next: NextFunction = mock();

    await auth(request, response, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid_token');
    expect((request as Request & { user: JWTAuthPayload }).user).toEqual(
      payload
    );
    expect(next).toHaveBeenCalled();
  });

  it('should throw AuthorizedError when accessToken is missing', async () => {
    const request = {
      cookies: {},
    } as Request;

    const response = {} as Response;
    const next: NextFunction = mock();

    await auth(request, response, next);

    expect(next).toHaveBeenCalledWith(expect.any(AuthorizedError));
  });

  it('should throw AuthorizedError when token is invalid', async () => {
    // Mocking jwt.verify to return null for invalid token
    jwt.verify = mock().mockReturnValue(null);

    const request = {
      cookies: {
        accessToken: 'invalid_token',
      },
    } as unknown as Request;

    const response = {} as Response;
    const next: NextFunction = mock();

    await auth(request, response, next);

    expect(jwt.verify).toHaveBeenCalledWith('invalid_token');
    expect(next).toHaveBeenCalledWith(expect.any(AuthorizedError));
  });
});
