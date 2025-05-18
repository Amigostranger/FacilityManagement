



import { getTotalUsers } from '../tot_users'; // Adjust path as needed
import fetch from 'node-fetch';

jest.mock('node-fetch', () => jest.fn());

global.fetch = fetch;

describe('getTotalUsers', () => {
  const originalConsoleError = console.error;

  beforeAll(() => {
    console.error = jest.fn(); // Silence error logs
  });

  afterAll(() => {
    console.error = originalConsoleError; // Restore original
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sets totalUsers to correct length on success', async () => {
    const mockUsers = [{}, {}, {}, {}]; // 4 users

    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockUsers),
    });

    await getTotalUsers();
    const { totalUsers } = await import('../tot_users');
    expect(totalUsers).toBe(4);
  });

  it('sets totalUsers to 0 on failed response (ok=false)', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await getTotalUsers();
    const { totalUsers } = await import('../tot_users');
    expect(totalUsers).toBe(0);
  });

  it('sets totalUsers to 0 on network error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await getTotalUsers();
    const { totalUsers } = await import('../tot_users');
    expect(totalUsers).toBe(0);
  });
});

