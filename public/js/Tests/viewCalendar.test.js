import { mapDataToEvents, fetchEvents } from '../viewCalendar.js';

global.fetch = jest.fn();

describe('mapDataToEvents', () => {
  it('should convert raw booking data to FullCalendar event format', () => {
    const input = [
      {
        title: 'Match',
        start: '2023-05-01T08:00:00Z',
        end: '2023-05-01T10:00:00Z',
        facility: 'Field A',
        description: 'Quarterfinals'
      }
    ];

    const expected = [
      {
        title: 'Match',
        start: '2023-05-01T08:00:00.000Z',
        end: '2023-05-01T10:00:00.000Z',
        extendedProps: {
          facility: 'Field A',
          description: 'Quarterfinals'
        }
      }
    ];

    expect(mapDataToEvents(input)).toEqual(expected);
  });
});

describe('fetchEvents', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call successCallback with approved events', async () => {
    const mockData = [
      {
        title: 'Game',
        start: '2023-06-01T09:00:00Z',
        end: '2023-06-01T11:00:00Z',
        facility: 'Court 1',
        description: 'Semifinal',
        status: 'Approved'
      },
      {
        title: 'Training',
        start: '2023-06-02T09:00:00Z',
        end: '2023-06-02T11:00:00Z',
        facility: 'Court 2',
        description: 'Morning session',
        status: 'Pending'
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const successCallback = jest.fn();
    const failureCallback = jest.fn();

    await fetchEvents({}, successCallback, failureCallback);

    expect(successCallback).toHaveBeenCalledWith([
      {
        title: 'Game',
        start: '2023-06-01T09:00:00.000Z',
        end: '2023-06-01T11:00:00.000Z',
        extendedProps: {
          facility: 'Court 1',
          description: 'Semifinal'
        }
      }
    ]);
    expect(failureCallback).not.toHaveBeenCalled();
  });

  it('should call failureCallback on fetch error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const successCallback = jest.fn();
    const failureCallback = jest.fn();

    await fetchEvents({}, successCallback, failureCallback);

    expect(successCallback).not.toHaveBeenCalled();
    expect(failureCallback).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should call failureCallback on non-200 response', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    const successCallback = jest.fn();
    const failureCallback = jest.fn();

    await fetchEvents({}, successCallback, failureCallback);

    expect(successCallback).not.toHaveBeenCalled();
    expect(failureCallback).toHaveBeenCalledWith(expect.any(Error));
  });
});
