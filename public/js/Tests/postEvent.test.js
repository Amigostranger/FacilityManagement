// postEvent.test.js
import { postEvent } from '../postEvent';
// import fetch from 'node-fetch';
// global.fetch = fetch

global.fetch = jest.fn(); // Mock the fetch function globally

describe('postEvent', () => {
  const mockUser = {
    getIdToken: jest.fn().mockResolvedValue('mock-token')
  };

  const mockResponseData = { success: true };
  const mockResponse = {
    json: jest.fn().mockResolvedValue(mockResponseData)
  };

  beforeEach(() => {
    fetch.mockResolvedValue(mockResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sends a POST request with the correct payload and headers', async () => {
    const eventDetails = {
      user: mockUser,
      title: 'Team Practice',
      description: 'Weekly training session',
      facility: 'Field A',
      start: '2025-05-25T10:00:00Z',
      end: '2025-05-25T12:00:00Z',
      who: 'Team Alpha'
    };

    const result = await postEvent(eventDetails);

    expect(mockUser.getIdToken).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      'https://sports-management.azurewebsites.net/api/createEvent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token'
        },
        body: JSON.stringify({
          title: eventDetails.title,
          description: eventDetails.description,
          facility: eventDetails.facility,
          start: eventDetails.start,
          end: eventDetails.end,
          who: eventDetails.who
        })
      }
    );
    expect(result).toEqual({ res: mockResponse, data: mockResponseData });
  });
});
