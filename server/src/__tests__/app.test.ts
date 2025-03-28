import request from 'supertest';
import { app } from '../app';
import fs from 'fs';
import { CLIENT_DIST_PATH } from '../app';

describe('API Endpoints', () => {
  it('should return welcome message on GET /api', async () => {
    const response = await request(app).get('/api');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Welcome to the Mentat API!');
  });

  it('should handle stock data requests', async () => {
    // This is a basic test to ensure our stock endpoint is registered
    // The actual API call to Alpha Vantage is mocked in the real implementation
    const response = await request(app).get('/api/stock/AAPL');
    
    // We'll at least get a response, even if it might be an error due to the API key
    expect(response.status).not.toBe(404);
  });

  // Conditional test for serving the React app
  // This test only runs if the client/dist directory exists
  const clientDistExists = fs.existsSync(CLIENT_DIST_PATH);
  (clientDistExists ? it : it.skip)('should serve the React app on GET /', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.header['content-type']).toContain('text/html');
  });
});
