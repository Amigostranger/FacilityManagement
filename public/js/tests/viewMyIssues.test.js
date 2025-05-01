const viewMyIssues = require("./viewMyIssues");

describe("viewMyIssues", () => {
  let fakeDB;

  beforeEach(() => {
    fakeDB = {
      collection: jest.fn(() => fakeDB),
      where: jest.fn(() => fakeDB),
      get: jest.fn(),
    };
  });

  test("returns issues for valid uid", async () => {
    fakeDB.get.mockResolvedValueOnce({
      docs: [
        {
          id: "issue1",
          data: () => ({
            title: "Broken door",
            description: "Main entrance is broken",
            status: "Pending",
            submittedBy: "user123",
          }),
        },
      ],
    });

    const result = await viewMyIssues(fakeDB, "user123");

    expect(result.status).toBe(200);
    expect(result.body.issues).toHaveLength(1);
    expect(result.body.issues[0].title).toBe("Broken door");
  });

  test("returns 401 if uid is not provided", async () => {
    const result = await viewMyIssues(fakeDB, null);
    expect(result.status).toBe(401);
    expect(result.body.error).toBe("Unauthorized");
  });

  test("returns 500 if firestore throws an error", async () => {
    fakeDB.get.mockRejectedValueOnce(new Error("Firestore failure"));

    const result = await viewMyIssues(fakeDB, "user123");

    expect(result.status).toBe(500);
    expect(result.body.error).toBe("Failed to get issues");
  });
});
