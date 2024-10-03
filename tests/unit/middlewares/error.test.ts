import { describe, it, expect, mock } from 'bun:test';
import error from '../../../src/middlewares/error';
import {
  ValidationError,
  AuthorizedError,
} from '../../../src/libs/utils/error';
import { logger } from '../../../src/libs/utils/logger';
import type { Request, Response, NextFunction } from 'express';

describe('[Unit test] - error - middleware', () => {
  it('should handle ValidationError and respond with 400', async () => {
    const validationError = new ValidationError(['some issue']);

    const request = {} as Request;
    const responseMock = {
      json: mock(),
      status: mock().mockReturnThis(),
    } as unknown as Response;
    const next: NextFunction = mock();

    error(validationError, request, responseMock, next);

    expect(responseMock.status).toHaveBeenCalledWith(400);
    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 400,
        message: 'Validation error.',
        data: { issues: validationError.issues },
      })
    );
  });

  it('should handle AuthorizedError and respond with 401', async () => {
    const authError = new AuthorizedError('Unauthorized');

    const request = {} as Request;
    const responseMock = {
      json: mock(),
      status: mock().mockReturnThis(),
    } as unknown as Response;
    const next: NextFunction = mock();

    error(authError, request, responseMock, next);

    expect(responseMock.status).toHaveBeenCalledWith(401);
    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 401,
        message: 'Unauthorized',
      })
    );
  });

  it('should log error and respond with 500 for unknown errors', async () => {
    const genericError = new Error('Something went wrong');

    const request = {} as Request;
    const responseMock = {
      json: mock(),
      status: mock().mockReturnThis(),
    } as unknown as Response;
    const next: NextFunction = mock();

    logger.error = mock();

    error(genericError, request, responseMock, next);

    expect(logger.error).toHaveBeenCalledWith('Something went wrong', {
      stack: genericError.stack,
    });

    expect(responseMock.status).toHaveBeenCalledWith(500);
    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 500,
        message: 'Internal Server Error',
      })
    );
  });
});
