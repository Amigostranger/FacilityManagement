const approveBooking = require('../approveBooking.js');

describe('approveBooking', () => {
  let mockDb, mockDoc, mockBookingRef;

  beforeEach(() => {
    // Reset mocks before each test
    mockDoc = {
      exists: true,
      data: jest.fn().mockReturnValue({ status: 'Pending' }),
    };

    mockBookingRef = {
      get: jest.fn().mockResolvedValue(mockDoc),
      update: jest.fn().mockResolvedValue(),
    };

    mockDb = {
      collection: jest.fn().mockReturnThis(),
      doc: jest.fn().mockReturnValue(mockBookingRef),
    };
  });

  test('returns 400 for invalid status', async () => {
    const res = await approveBooking(mockDb, 'abc123', 'WrongStatus');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid status/);
  });

  test('returns 400 for missing bookId', async () => {
    const res = await approveBooking(mockDb, '', 'Approved');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid status/);
  });

  test('returns 404 if booking does not exist', async () => {
    mockDoc.exists = false;
    const res = await approveBooking(mockDb, 'abc123', 'Approved');
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/);
  });

  test('successfully updates booking status', async () => {
    const res = await approveBooking(mockDb, 'abc123', 'Approved');
    expect(mockBookingRef.update).toHaveBeenCalledWith({ status: 'Approved' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Approved');
    expect(res.body.message).toMatch(/status updated/);
  });

  test('returns 500 on unexpected error', async () => {
    mockBookingRef.get.mockRejectedValue(new Error('Firestore error'));

    const res = await approveBooking(mockDb, 'abc123', 'Approved');
    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/Server error/);
  });
});
