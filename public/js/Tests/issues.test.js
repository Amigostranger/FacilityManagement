import express from 'express';
import request from 'supertest';
import createIssuesRouter from '../routes/issuesRouter.js';

describe('Issues Router', () => {
  let app;
  let mockDb;

  beforeEach(() => {
    mockDb = {
      collection: jest.fn().mockReturnThis(),
      get: jest.fn(),
      where: jest.fn().mockReturnThis(),
    };

    // Stub Firebase Admin Auth
    const mockAdmin = {
      auth: () => ({}) // mocked auth object for verifyToken
    };

    app = express();
    app.use(express.json());
    app.use(createIssuesRouter(mockDb, mockAdmin));
  });

  test('GET /api/issues/all - should return all issues', async () => {
    const mockData = [
      {
        id: 'issue1',
        data: () => ({
          title: 'Test Issue',
          description: 'This is a test',
          facility: 'Gym',
          status: 'Pending',
          createdAt: { toDate: () => new Date() }
        })
      }
    ];

    mockDb.collection.mockReturnValue({
      get: jest.fn().mockResolvedValue({
        docs: mockData
      })
    });

    const res = await request(app).get('/api/issues/all');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.issues.length).toBe(1);
    expect(res.body.issues[0].title).toBe('Test Issue');
  });

  // You can add mock Firebase auth logic for protected routes
  // Here's an example placeholder:
  test('GET /api/issues - requires auth, returns user issues', async () => {
    // mock verifyToken middleware or use a custom test version
    // add tests for authorized route behavior
  });
});
