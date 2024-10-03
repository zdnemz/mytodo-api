import { describe, it, expect, mock } from 'bun:test';
import notFound from '../../../src/middlewares/notFound';
import type { Request, Response, NextFunction } from 'express';

describe('[Unit test] - notFound - middleware', () => {
  it('should return response when it is called', async () => {
    const request = {} as unknown as Request;

    const response = {
      status: mock().mockReturnThis(),
      json: mock(),
    } as unknown as Response;

    const next = mock() as NextFunction;

    await notFound(request, response, next);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ code: 404, message: 'Not found.' })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
