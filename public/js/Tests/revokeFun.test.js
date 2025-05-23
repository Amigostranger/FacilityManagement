import { fetchUsers, revokeUser } from '../revokeFun.js';
import fetch from 'node-fetch';
global.fetch = fetch;

jest.mock('node-fetch', () => jest.fn());

beforeEach(() => {
  fetch.mockReset();
});

test('fetchUsers returns user data on success', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [{ id: '1', email: 'test@example.com', role: 'resident' }]
  });

  const users = await fetchUsers();
  expect(users).toHaveLength(1);
  expect(users[0].email).toBe('test@example.com');
});

test('fetchUsers returns empty array on failure', async () => {
  fetch.mockRejectedValueOnce(new Error("API is down"));

  const users = await fetchUsers();
  expect(users).toEqual([]);
});

test('revokeUser sends PUT request and returns result', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ success: true })
  });

  const result = await revokeUser('123');
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining('/api/user-revoke/123'),
    expect.objectContaining({
      method: "PUT",
      body: JSON.stringify({ status: "revoked" })
    })
  );
  expect(result.success).toBe(true);
});

test('revokeUser throws on error response', async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ message: "Error" })
  });

  await expect(revokeUser('123')).rejects.toThrow("Error");
});
