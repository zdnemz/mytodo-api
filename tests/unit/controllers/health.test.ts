import { describe, it, expect, mock } from 'bun:test';
import health from '../../../src/controllers/health';
import type { Request, Response, NextFunction } from 'express';

describe('[unit test] - health - controller', () => {
  it('should be ok', async () => {
    const req = {} as Request;
    const res = {
      json: mock(),
      status: mock().mockReturnThis(),
    } as unknown as Response;
    const next: NextFunction = mock();

    await health(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
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
