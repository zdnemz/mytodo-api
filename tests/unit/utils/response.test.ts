import { describe, it, expect, mock } from 'bun:test';
import response, { status } from '../../../src/libs/utils/response';
import type { Response as ExpressResponse } from 'express';

describe('[Unit test] - response utility', () => {
  it('should return a success response with data', () => {
    const res = {
      status: mock().mockReturnThis(),
      json: mock(),
    } as unknown as ExpressResponse;

    const data = { id: 1, name: 'Test' };

    response(res, {
      code: 200,
      message: 'Success',
      data,
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      code: 200,
      message: 'Success',
      data,
    });
  });

  it('should return an error response with issues', () => {
    const res = {
      status: mock().mockReturnThis(),
      json: mock(),
    } as unknown as ExpressResponse;

    const error = 'Invalid input';

    response(res, {
      code: 400,
      message: 'Bad Request',
      error,
    });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      code: 400,
      message: 'Bad Request',
      data: {
        issues: [error],
      },
    });
  });

  it('should default to status message if no message is provided', () => {
    const res = {
      status: mock().mockReturnThis(),
      json: mock(),
    } as unknown as ExpressResponse;

    response(res, {
      code: 201,
      data: { id: 1 },
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      code: 201,
      message: status[201], // Should default to 'Created'
      data: { id: 1 },
    });
  });

  it('should handle no data and no message', () => {
    const res = {
      status: mock().mockReturnThis(),
      json: mock(),
    } as unknown as ExpressResponse;

    response(res, {
      code: 204,
    });

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      code: 204,
      message: status[204], // Should default to 'No Content'
    });
  });
});
