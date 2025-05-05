import { signInCore } from './signInCore.js';
import { check } from './check.js';

global.fetch = jest.fn();

jest.mock('./check.js', () => ({
  check: jest.fn(),
}));

describe('signInCore', () => {
  const mockUser = {
    email: 'test@example.com',
    displayName: 'Test User',
    getIdToken: jest.fn().mockResolvedValue('mocked_token')
  };

  beforeEach(() => {
    fetch.mockClear();
    check.mockClear();
  });

  it('should return success if user is allowed', async () => {
    check.mockResolvedValue('allowed');
    fetch.mockResolvedValueOnce({
      json: async () => ({ message: 'User saved' }),
    });

    const result = await signInCore(mockUser);

    expect(result.success).toBe(true);
    expect(fetch).toHaveBeenCalledWith("https://sports-management.azurewebsites.net/api/save-user", expect.anything());
  });

  it('should alert and return empty if user is revoked', async () => {
    global.alert = jest.fn();
    check.mockResolvedValue('revoked');

    const result = await signInCore(mockUser);

    expect(alert).toHaveBeenCalledWith("Your account has been revoked.");
    expect(result).toEqual({});
  });
});
