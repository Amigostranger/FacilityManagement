// // __tests__/checkUserStatus.test.js
const checkUserStatus = require("./checkUserStatus");
describe("checkUserStatus", () => {
  let fakeDB;

  beforeEach(() => {
    fakeDB = {
      collection: jest.fn(() => fakeDB),
      where: jest.fn(() => fakeDB),
      get: jest.fn()
    };
  });

  test("returns 'revoked' if user has revoked status", async () => {
    fakeDB.get.mockResolvedValueOnce({
      empty: false,
      docs: [
        {
          data: () => ({ email: "test@example.com", status: "revoked" })
        }
      ]
    });

    const result = await checkUserStatus(fakeDB, "test@example.com");
    expect(result.status).toBe(200);
    expect(result.body.status).toBe("revoked");
  });

  test("returns 'Allowed' if user status is not revoked", async () => {
    fakeDB.get.mockResolvedValueOnce({
      empty: false,
      docs: [
        {
          data: () => ({ email: "user@example.com", status: "allowed" })
        }
      ]
    });

    const result = await checkUserStatus(fakeDB, "user@example.com");
    expect(result.body.status).toBe("Allowed");
  });

  test("returns error if no user found", async () => {
    fakeDB.get.mockResolvedValueOnce({
      empty: true,
      docs: []
    });

    const result = await checkUserStatus(fakeDB, "nouser@example.com");
    expect(result.body.error).toBe("user not available");
  });
});

  