import { getBookingsData } from '../linegraph_bookings.js';
 // adjust path as needed
import fetch from 'node-fetch';

global.fetch = fetch;
jest.mock('node-fetch', () => jest.fn());

describe('getBookingsData', () => {
  const mockMonthlyData = [3, 5, 2, 0, 1, 4, 6, 7, 2, 1, 0, 8]; // Expected 12-element array

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return monthly booking data on successful fetch', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMonthlyData
    });

    const result = await getBookingsData();
    expect(result).toEqual(mockMonthlyData);
    expect(fetch).toHaveBeenCalledWith('https://sports-management.azurewebsites.net/api/get-bookings-per-month');
  });

  it('should return fallback data if fetch response is not ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Internal Server Error' }),
      status: 500
    });

    const result = await getBookingsData();
    expect(result).toEqual(Array(12).fill(0));
  });

  it('should handle fetch rejection (network error)', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    const result = await getBookingsData();
    expect(result).toEqual(Array(12).fill(0));
  });

  it('should handle invalid JSON in error response gracefully', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => { throw new Error("Invalid JSON") },
      status: 500
    });

    const result = await getBookingsData();
    expect(result).toEqual(Array(12).fill(0));
  });
});
