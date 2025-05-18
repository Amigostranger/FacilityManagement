import { getTotalUsers } from '../tot_users.js'; // adjust the path
import fetch from 'node-fetch';

global.fetch = fetch;
jest.mock('node-fetch', () => jest.fn());

describe('getTotalUsers', () => {
  it('should set totalUsers to data length on successful fetch', async () => {
    const mockUsers = [{}, {}, {}]; // 3 users
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    await getTotalUsers();
    const { totalUsers } = await import('../path-to-your-module'); // re-import to get updated value

    expect(totalUsers).toBe(3);
  });

  it('should set totalUsers to 0 on fetch failure', async () => {
    fetch.mockRejectedValueOnce(new Error('API failure'));

    await getTotalUsers();
    const { totalUsers } = await import('../path-to-your-module');

    expect(totalUsers).toBe(0);
  });

  it('should set totalUsers to 0 when response is not ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    await getTotalUsers();
    const { totalUsers } = await import('../path-to-your-module');

    expect(totalUsers).toBe(0);
  });
});
