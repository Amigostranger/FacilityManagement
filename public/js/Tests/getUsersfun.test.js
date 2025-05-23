import { getUser } from '../getUsersfun.js';

global.fetch = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

test('getUser returns username when user found', async () => {
  fetch.mockResolvedValueOnce({
    json: async () => [{ id: '123', username: 'JohnDoe' }]
  });

  const result = await getUser('123');
  expect(result).toBe('JohnDoe');
});

test('getUser returns "N/A" when user not found', async () => {
  fetch.mockResolvedValueOnce({
    json: async () => [{ id: '999', username: 'SomeoneElse' }]
  });

  const result = await getUser('123');
  expect(result).toBe('N/A');
});

test('getUser returns "N/A" on fetch error', async () => {
  fetch.mockRejectedValueOnce(new Error('Network Error'));

  const result = await getUser('123');
  expect(result).toBe('N/A');
});
