import fetch from 'node-fetch';
import {
  fetchAdminUsers,
  revokeAdminUser,
  updateUserRole
} from '../adminRevokeFun.js';

global.fetch = fetch;
jest.mock('node-fetch', () => jest.fn());

beforeEach(() => {
  fetch.mockReset();
});

test('fetchAdminUsers filters out admins (case-insensitive)', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      { id: '1', email: 'a@example.com', role: 'admin' },
      { id: '2', email: 'b@example.com', role: 'staff' },
      { id: '3', email: 'c@example.com', role: 'resident' },
    ]
  });

  const users = await fetchAdminUsers();
  expect(users).toEqual([
    { id: '2', email: 'b@example.com', role: 'staff' },
    { id: '3', email: 'c@example.com', role: 'resident' }
  ]);
});

test('fetchAdminUsers returns [] on error', async () => {
  fetch.mockRejectedValueOnce(new Error("API error"));
  const users = await fetchAdminUsers();
  expect(users).toEqual([]);
});

test('revokeAdminUser sends PUT request correctly', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ success: true })
  });

  const result = await revokeAdminUser('123');
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining('/api/user-revoke/123'),
    expect.objectContaining({
      method: "PUT",
      body: JSON.stringify({ status: "revoked" })
    })
  );
  expect(result.success).toBe(true);
});

test('updateUserRole sends PUT request and returns result', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ role: 'Resident' })
  });

  const result = await updateUserRole('456', 'Resident');
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining('/api/user/456'),
    expect.objectContaining({
      method: "PUT",
      body: JSON.stringify({ role: 'Resident' })
    })
  );
  expect(result.role).toBe('Resident');
});
