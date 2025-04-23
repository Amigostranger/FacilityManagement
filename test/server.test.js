import request from 'supertest';
import { jest } from '@jest/globals';

jest.unstable_mockModule('firebase-admin', () => ({
  default: {
    initializeApp: jest.fn(),
    credential: { cert: jest.fn() },
    firestore: () => ({
      collection: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({
          docs: [
            {
              id: 'issue1',
              data: () => ({
                title: 'Leaking roof',
                submittedBy: 'testUid',
              }),
            },
          ],
        }),
      }),
    }),
    auth: () => ({
      verifyIdToken: jest.fn().mockResolvedValue({ uid: 'testUid' }),
    }),
  },
}));

// Top-level await to ensure dynamic import after mocking
const { default: app } = await import('../server.js');

describe('Facility Management API', () => {
  test('GET /login serves login page', async () => {
    const res = await request(app).get('/login');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });

  test('GET /api/issues returns user issues with valid token', async () => {
    const res = await request(app)
      .get('/api/issues')
      .set('Authorization', 'Bearer fake-token');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.issues)).toBe(true);
    expect(res.body.issues[0]).toHaveProperty('title', 'Leaking roof');
  });
});
