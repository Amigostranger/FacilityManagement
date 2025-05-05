const submitBooking = require("./submitBooking");

describe("submitBooking", () => {
  let fakeDB, fakeAdmin;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    fakeDB = {
      collection: jest.fn(() => fakeDB),
      where: jest.fn(() => fakeDB),
      get: jest.fn(),
      add: jest.fn(),
    };

    fakeAdmin = {
      firestore: {
        Timestamp: {
          fromDate: (date) => ({ seconds: Math.floor(date.getTime() / 1000) }),
        },
      },
    };
  });

  test("returns 400 if fields are missing", async () => {
    const result = await submitBooking(fakeDB, fakeAdmin, "uid123", {
      title: "Booking",
      description: "",
      facility: "Gym",
      start: "2025-05-01T12:00",
      end: "2025-05-01T14:00",
      who: "resident"
    });

    expect(result.status).toBe(400);
    expect(result.body.error).toBe("All fields required");
  });

  test("returns 409 if overlapping booking exists", async () => {
    fakeDB.get.mockResolvedValueOnce({ empty: false });

    const result = await submitBooking(fakeDB, fakeAdmin, "uid123", {
      title: "Booking",
      description: "Test",
      facility: "Gym",
      start: "2025-05-01T12:00",
      end: "2025-05-01T14:00",
      who: "resident"
    });

    expect(result.status).toBe(409);
    expect(result.body.error).toBe("Booking conflict detected");
  });

  test("returns 200 if booking is added successfully", async () => {
    fakeDB.get.mockResolvedValueOnce({ empty: true });
    fakeDB.add.mockResolvedValueOnce(true);

    const result = await submitBooking(fakeDB, fakeAdmin, "uid123", {
      title: "Booking",
      description: "Test",
      facility: "Gym",
      start: "2025-05-01T12:00",
      end: "2025-05-01T14:00",
      who: "resident"
    });

    expect(result.status).toBe(200);
    expect(result.body.message).toBe("Booking submitted");
  });

  test("returns 500 if Firestore throws an error", async () => {
    fakeDB.get.mockRejectedValueOnce(new Error("Firestore error"));

    const result = await submitBooking(fakeDB, fakeAdmin, "uid123", {
      title: "Booking",
      description: "Test",
      facility: "Gym",
      start: "2025-05-01T12:00",
      end: "2025-05-01T14:00",
      who: "resident"
    });

    expect(result.status).toBe(500);
    expect(result.body.error).toBe("Failed to save Booking");
  });
});
