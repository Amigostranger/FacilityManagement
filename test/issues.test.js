import request from 'supertest';
import app from '../server';
import jest from 'jest'; // Add this line to avoid 'jest is not defined'

describe('Maintenance Issues API', () => {
  // Helper function to mock authentication middleware
  const mockToken = (role) => (req, res, next) => {
    req.user = { uid: 'fakeUID123', role };  // Mocking user based on role
    next();  // Call next() to pass control to the next middleware
  };

  beforeEach(() => {
    // Reset the server or application state before each test if needed
    jest.resetModules();  // If you need to reset modules between tests
  });

  it('should allow Resident to report a new issue', async () => {
    const response = await request(app)
      .post('/api/report')  // Use the correct API endpoint for reporting
      .use(mockToken('Resident')) // Use mock middleware to simulate authentication
      .send({
        title: 'Leaking Pipe',
        description: 'There is a leaking pipe in the kitchen.',
        facility: 'Kitchen',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Report submitted');
  });

  it('should allow Staff to update issue status', async () => {
    const response = await request(app)
      .patch('/api/issues/1')
      .use(mockToken('Staff')) // Use mock middleware to simulate authentication
      .send({
        status: 'Resolved',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Issue status updated');
  });

  it('should not allow Resident to update issue status', async () => {
    const response = await request(app)
      .patch('/api/issues/1')
      .use(mockToken('Resident')) // Use mock middleware to simulate authentication
      .send({
        status: 'Resolved',
      });

    expect(response.status).toBe(403); // Forbidden for residents
    expect(response.body.error).toBe('You are not authorized to update the issue status');
  });
});
