import { loadActiveUsers } from '../active_users';

// Mock the fetch API
global.fetch = jest.fn();

describe('loadActiveUsers', () => {
  beforeEach(() => {
    fetch.mockClear(); // clear mock before each test
  });

  it('should return active users data when fetch is successful', async () => {
    const mockResponse = [{ name: "John Doe", active: true }];

    // Setup the mock fetch implementation
    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse)
    });

    const result = await loadActiveUsers();

    expect(fetch).toHaveBeenCalledWith("https://sports-management.azurewebsites.net/api/activeUsers");
    expect(result).toEqual(mockResponse);
  });

  it('should log error when fetch fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    fetch.mockRejectedValue(new Error("Network Error"));

    const result = await loadActiveUsers();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching Active users',
      expect.any(Error)
    );
    expect(result).toBeUndefined();

    consoleSpy.mockRestore();
  });
});