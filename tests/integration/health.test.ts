import { describe, it, expect } from 'bun:test';
import request from 'supertest';
import server from '../../src/libs/app/server';

describe('[integration test] - /api/health', () => {
  it('should be return status code 200', async () => {
    const response = await request(server).get('/api/health');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: true,
      code: 200,
      message: 'health ok!',
    });
  });
});
