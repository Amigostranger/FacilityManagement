import { mapDataToEvents, fetchEvents } from '../viewCalendar';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

describe('mapDataToEvents', () => {
  it('should convert booking data into FullCalendar event format', () => {
    const input = [
      {
        title: 'Football Match',
        start: '2025-05-01T10:00:00Z',
        end: '2025-05-01T12:00:00Z',
        facility: 'Stadium A',
        description: 'Semi-final game',
      }
    ];

    const expected = [
      {
        title: 'Football Match',
        start: new Date('2025-05-01T10:00:00Z').toISOString(),
        end: new Date('2025-05-01T12:00:00Z').toISOString(),
        extendedProps: {
          facility: 'Stadium A',
          description: 'Semi-final game'
        }
      }
    ];

    expect(mapDataToEvents(input)).toEqual(expected);
  });
});

describe('fetchEvents', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should fetch approved bookings and map them to events', async () => {
    const mockBookings = [
      { title: 'Game A', start: '2025-05-01T10:00:00Z', end: '2025-05-01T12:00:00Z', facility: 'Field 1', description: 'Desc A', status: 'Approved' },
      { title: 'Game B', start: '2025-05-02T10:00:00Z', end: '2025-05-02T12:00:00Z', facility: 'Field 2', description: 'Desc B', status: 'Pending' },
    ];

    fetch.mockResponseOnce(JSON.stringify(mockBookings));

    const successCallback = jest.fn();
    const failureCallback = jest.fn();

    await fetchEvents({}, successCallback, failureCallback);

    expect(successCallback).toHaveBeenCalledTimes(1);
    expect(failureCallback).not.toHaveBeenCalled();

    const events = successCallback.mock.calls[0][0];
    expect(events.length).toBe(1);
    expect(events[0].title).toBe('Game A');
  });

  it('should handle fetch failure', async () => {
    fetch.mockReject(new Error('Network error'));

    const successCallback = jest.fn();
    const failureCallback = jest.fn();

    await fetchEvents({}, successCallback, failureCallback);

    expect(successCallback).not.toHaveBeenCalled();
    expect(failureCallback).toHaveBeenCalled();
  });
});
