import { describe, it, expect, mock } from 'bun:test';
import health from '../../../src/controllers/health';
import type { Request, Response, NextFunction } from 'express';

describe('[Unit test] - health - controller', () => {
  it('should return 200 when ok', async () => {
    const request = {} as Request;
    const response = {
      json: mock(),
      status: mock().mockReturnThis(),
    } as unknown as Response;
    const next: NextFunction = mock();

    await health(request, response, next);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        code: 200,
        message: 'health ok!',
        data: undefined,
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
