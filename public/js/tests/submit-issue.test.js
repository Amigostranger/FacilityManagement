const submitIssue = require("./submitIssue");

describe("submitIssue", () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  let fakeDB;

  beforeEach(() => {
    fakeDB = {
      collection: jest.fn(() => fakeDB),
      add: jest.fn(),
    };
  });

  test("returns 200 when submission is successful", async () => {
    fakeDB.add.mockResolvedValueOnce();

    const result = await submitIssue(fakeDB, "user1", "Leaky pipe", "Water leaking in shower", "Gym");

    expect(result.status).toBe(200);
    expect(result.body.message).toBe("Report submitted");
  });

  test("returns 400 when any field is missing", async () => {
    const result = await submitIssue(fakeDB, "user1", "", "Missing description", "");

    expect(result.status).toBe(400);
    expect(result.body.error).toBe("All fields required");
  });

  test("returns 401 when uid is missing", async () => {
    const result = await submitIssue(fakeDB, null, "Leak", "Water issue", "Pool");

    expect(result.status).toBe(401);
    expect(result.body.error).toBe("Unauthorized");
  });

  test("returns 500 on Firestore error", async () => {
    fakeDB.add.mockRejectedValueOnce(new Error("Firestore down"));

    const result = await submitIssue(fakeDB, "user1", "Broken AC", "Too hot", "Hall");

    expect(result.status).toBe(500);
    expect(result.body.error).toBe("Failed to save report");
  });
});
