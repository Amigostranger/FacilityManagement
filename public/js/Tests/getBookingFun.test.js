import { fetchBookings, updateBookingStatus } from '../getBookingFun.js';

global.fetch = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

test('fetchBookings returns data on success', async () => {
  const mockData = [{ bookId: 'b1', title: 'Test Booking' }];
  fetch.mockResolvedValueOnce({
    json: async () => mockData
  });

  const result = await fetchBookings();
  expect(result).toEqual(mockData);
});

test('fetchBookings returns empty array on error', async () => {
  fetch.mockRejectedValueOnce(new Error('Network error'));

  const result = await fetchBookings();
  expect(result).toEqual([]);
});

test('updateBookingStatus logs success when ok', async () => {
  fetch.mockResolvedValueOnce({ ok: true });

  console.log = jest.fn();
  await updateBookingStatus('b1', 'Approved');
  expect(console.log).toHaveBeenCalledWith('Status changed to Approved');
});

test('updateBookingStatus throws and logs error when response not ok', async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    text: async () => "Server Error"
  });

  console.error = jest.fn();

  await updateBookingStatus('b1', 'Declined');
  expect(console.error).toHaveBeenCalledWith("Error updating status:", "Server Error");
});
