// approve-booking.test.js
const approveBooking = require("./approveBooking");

describe("approveBooking", () => {
  let fakeDB;
  
  beforeEach(() => {
    fakeDB = {
      collection: jest.fn(() => fakeDB),
      doc: jest.fn(() => fakeDB),
      get: jest.fn(),
      update: jest.fn(),
    };
  });

  test("returns 'Approved' status if the booking is approved", async () => {
    fakeDB.get.mockResolvedValueOnce({
      exists: true,
    });
    fakeDB.update.mockResolvedValueOnce(true);

    const result = await approveBooking(fakeDB, "1", "Approved");
    
    expect(result.status).toBe(200);
    expect(result.body.status).toBe("Approved");
  });

  test("returns 'Declined' status if the booking is declined", async () => {
    fakeDB.get.mockResolvedValueOnce({
      exists: true,
    });
    fakeDB.update.mockResolvedValueOnce(true);

    const result = await approveBooking(fakeDB, "2", "Declined");

    expect(result.status).toBe(200);
    expect(result.body.status).toBe("Declined");
  });

  test("returns error if booking is not found", async () => {
    fakeDB.get.mockResolvedValueOnce({
      exists: false,
    });

    const result = await approveBooking(fakeDB, "3", "Approved");

    expect(result.status).toBe(404);
    expect(result.body.error).toBe("Booking not found");
  });

  test("returns error if an invalid status is provided", async () => {
    const result = await approveBooking(fakeDB, "4", "InvalidStatus");

    expect(result.status).toBe(400);
    expect(result.body.error).toBe("Invalid status provided");
  });
});
