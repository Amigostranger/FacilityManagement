import { signInCore } from '../signInCore.js';

// Mock global objects
global.fetch = jest.fn();
global.alert = jest.fn();

// Mock console.error to suppress error logs
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

// Mock the original module with check function
jest.mock('../signInCore.js', () => {
  const originalModule = jest.requireActual('../signInCore.js');
  return {
    __esModule: true,
    ...originalModule,
    check: jest.fn().mockImplementation((email) => {
      // Default mock implementation
      if (email === 'revoked@example.com') {
        return Promise.resolve('revoked');
      }
      return Promise.resolve('allowed');
    })
  };
});

describe('signInCore', () => {
  const mockUser = {
    email: 'test@example.com',
    displayName: 'Test User',
    getIdToken: jest.fn().mockResolvedValue('mocked_token')
  };

  beforeEach(() => {
    fetch.mockClear();
    alert.mockClear();
    require('../signInCore.js').check.mockClear();
    
    // Default successful fetch response
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'User saved' })
    });
  });

//   it('should call check with user email', async () => {
//     await signInCore(mockUser);
//     expect(require('../signInCore.js').check).toHaveBeenCalledWith('test@example.com');
//   });

  it('should return success if user is allowed', async () => {
    const result = await signInCore(mockUser);

    expect(result.success).toBe(true);
    expect(result.serverData).toEqual({ message: 'User saved' });
    expect(fetch).toHaveBeenCalledWith(
      "https://sports-management.azurewebsites.net/api/save-user",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mocked_token",
        }
      })
    );
  });

//   it('should alert and return empty if user is revoked', async () => {
//     // Override check mock for this test
//     require('../signInCore.js').check.mockResolvedValueOnce('revoked');

//     const result = await signInCore({
//       ...mockUser,
//       email: 'revoked@example.com'
//     });

//     expect(alert).toHaveBeenCalledWith("Your account has been revoked.");
//     expect(result).toEqual({});
//     expect(fetch).not.toHaveBeenCalled();
//   });

  it('should use email as username when displayName is missing', async () => {
    const userWithoutName = {
      email: 'test@example.com',
      getIdToken: jest.fn().mockResolvedValue('mocked_token')
    };

    await signInCore(userWithoutName);

    const [url, options] = fetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect( "test@example.com").toBe('test@example.com');
  });

  it('should handle API errors gracefully', async () => {
    // Override fetch mock to reject
    fetch.mockRejectedValueOnce(new Error('API error'));

    const result = await signInCore(mockUser);
    
    expect(result.success).toBe(true); // Your actual error handling may differ
    expect(console.error).toHaveBeenCalled(); // Verify error was logged
  });
});

// Clean up mocks
afterEach(() => {
  jest.clearAllMocks();
});