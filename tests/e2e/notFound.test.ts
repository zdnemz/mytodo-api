import { describe, it, expect } from 'bun:test';
import request from 'supertest';
import server from '../../src/libs/app/server';

describe('[End-to-end test] - /api/notFound  - ALL', () => {
  it('should be return status code 404 when path is wrong using GET method', async () => {
    const response = await request(server).get('/api/wrong-path');

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: false,
      code: 404,
      message: 'Not found.',
    });
  });

  it('should be return status code 404 when path is wrong using POST method', async () => {
    const response = await request(server).post('/api/wrong-path');

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: false,
      code: 404,
      message: 'Not found.',
    });
  });

  it('should be return status code 404 when path is wrong using PUT method', async () => {
    const response = await request(server).put('/api/wrong-path');

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: false,
      code: 404,
      message: 'Not found.',
    });
  });

  it('should be return status code 404 when path is wrong using DELETE method', async () => {
    const response = await request(server).delete('/api/wrong-path');

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      success: false,
      code: 404,
      message: 'Not found.',
    });
  });
});
