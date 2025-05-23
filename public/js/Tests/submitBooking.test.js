/**
 * @jest-environment jsdom
 */

import { submitBooking } from '../submitBooking.js';

global.fetch = jest.fn();

describe('submitBooking', () => {
  const bookingData = {
    title: 'Tennis',
    facility: 'Court 1',
    start: '2025-06-01T10:00:00',
    end: '2025-06-01T11:00:00'
  };

  const idToken = 'fake-token';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns success on valid booking submission', async () => {
    const mockResponse = {
      confirmationId: 'abc123'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await submitBooking(bookingData, idToken);

    expect(fetch).toHaveBeenCalledWith(
      "https://sports-management.azurewebsites.net/api/submit-bookings",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify(bookingData)
      })
    );

    expect(result).toEqual({ success: true, data: mockResponse });
  });

  it('returns error on server response with error message', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid time slot.' })
    });

    const result = await submitBooking(bookingData, idToken);

    expect(result).toEqual({ success: false, error: 'Invalid time slot.' });
  });

  it('returns error on network failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await submitBooking(bookingData, idToken);

    expect(result).toEqual({ success: false, error: 'Network error' });
  });
});
