// import request from 'supertest';
// import app from '../server.js';


// import { db } from '../public/js/firebase.js';  

// import { jest } from '@jest/globals';

// describe('Maintenance Issues API', () => {
//   let issueId;

//   beforeAll(async () => {
//     // Create a mock issue in Firestore
//     const issueRef = await db.collection("Issues").add({
//       title: "Mock Issue",
//       description: "Mock description",
//       facility: "Mock Facility",
//       submittedBy: "fakeUID123",
//       status: "Pending",
//       createdAt: new Date(),
//     });

//     issueId = issueRef.id;
//   });

//   afterAll(async () => {
//     // Clean up the mock issue
//     await db.collection("Issues").doc(issueId).delete();
//   });

//   it('should allow Staff to update issue status', async () => {
//     global.mockedUser = { uid: 'fakeUID123', role: 'Staff' };

//     const response = await request(app)
//       .patch(`/api/issues/${issueId}`)
//       .send({ status: 'Resolved' });

//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe('Issue status updated');
//   });

//   it('should not allow Resident to update issue status', async () => {
//     global.mockedUser = { uid: 'fakeUID123', role: 'Resident' };

//     const response = await request(app)
//       .patch(`/api/issues/${issueId}`)
//       .send({ status: 'Resolved' });

//     expect(response.status).toBe(403);
//     expect(response.body.error).toBe('You are not authorized to update the issue status');
//   });
// });

import request from 'supertest';
import app from '../server.js';
import { jest } from '@jest/globals';

describe('Maintenance Issues API', () => {
  // Modified mockToken implementation
  const mockToken = (role) => {
    return (req, res, next) => {
      req.user = { uid: 'fakeUID123', role };
      next();
    };
  };

  // Apply mock middleware to the app instance
  beforeAll(() => {
    app.use((req, res, next) => {
      // This will handle all requests with our mock token
      return mockToken('Resident')(req, res, next);
    });
  });

  afterAll(async () => {
    await new Promise(resolve => app.close(resolve));
  });

  it('should allow Resident to report a new issue', async () => {
    const response = await request(app)
      .post('/api/report')
      .send({
        title: 'Leaking Pipe',
        description: 'There is a leaking pipe in the kitchen.',
        facility: 'Kitchen',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Report submitted');
  });

  it('should allow Staff to update issue status', async () => {
    // Temporarily override middleware for this test
    app.use((req, res, next) => mockToken('Staff')(req, res, next));
    
    const response = await request(app)
      .patch('/api/issues/1')
      .send({
        status: 'Resolved',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Issue status updated');
  });

  it('should not allow Resident to update issue status', async () => {
    const response = await request(app)
      .patch('/api/issues/1')
      .send({
        status: 'Resolved',
      });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('You are not authorized to update the issue status');
  });
});
