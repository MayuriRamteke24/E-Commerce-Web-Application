import request from 'supertest';
import { createApp } from '../src/app.js';

describe('E-commerce API', () => {
  it('returns application health status', async () => {
    const app = createApp();

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'ok' });
  });

  it('returns a product catalog list', async () => {
    const app = createApp();

    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
