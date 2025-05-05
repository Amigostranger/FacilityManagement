/**
 * @jest-environment jsdom
 */

jest.mock('./firebase.js', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

const { waitFor } = require('@testing-library/dom');
const { onAuthStateChanged } = require('firebase/auth');

global.fetch = jest.fn();

describe("Notification view testing", () => {
  let userMock, tokenMock;

  beforeEach(() => {
    // Mock console.log to suppress the output
    console.log = jest.fn();
    document.body.innerHTML = `
      <table id="notificationTable"><tbody></tbody></table>
      <div id="viewModal" hidden></div>
      <span id="describe"></span>
      <span id="date"></span>
      <span id="facility"></span>
      <span id="start"></span>
      <span id="end"></span>
      <span id="counter" style="visibility: hidden;"></span>
      <button id="closeViewBtn"></button>
    `;

    tokenMock = "mocked-id-token";
    userMock = {
      email: "test@example.com",
      getIdToken: jest.fn().mockResolvedValue(tokenMock),
    };

    fetch.mockReset();

    fetch.mockImplementation((url) => {
      if (url.includes("notifications")) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              events: [
                {
                  id: 1,
                  title: "Test Event",
                  read: "false",
                  date: "2024-01-01",
                  facility: "Hall A",
                  start: "10:00",
                  end: "11:00",
                  description: "Test description",
                },
              ],
            }),
        });
      } else if (url.includes("count-read")) {
        return Promise.resolve({
          json: () => Promise.resolve({ countRead: 1 }),
        });
      } else if (url.includes("read")) {
        return Promise.resolve({
          json: () => Promise.resolve({ message: "Marked as read" }),
        });
      }
    });

    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(userMock);
    });

    // Load script under test *after mocks*
    jest.isolateModules(() => {
      require('./viewnotifications.js');
        // Manually trigger DOMContentLoaded to simulate browser behavior
        document.dispatchEvent(new Event("DOMContentLoaded"));
    });
  });

  it("should load notifications and update the DOM", async () => {
    await waitFor(() => {
      const rows = document.querySelectorAll("#notificationTable tbody tr");
      expect(rows.length).toBe(1);
      expect(rows[0].textContent).toContain("Test Event");
    });
  });

  it("should update unread counter", async () => {
    await waitFor(() => {
      const counter = document.getElementById("counter");
      expect(counter.innerText).toBe(1);
      expect(counter.style.visibility).toBe("visible");
    });
  });

  it("should open modal and mark notification as read when row is clicked", async () => {
    const row = await waitFor(() =>
      document.querySelector("#notificationTable tbody tr")
    );

    // Simulate click
    row.click();

    // Modal should be shown with correct details
    await waitFor(() => {
      const modal = document.getElementById("viewModal");
      expect(modal.hidden).toBe(false);
      expect(document.getElementById("describe").textContent).toBe("Test description");
    });

    // Verify that 'read' endpoint was called
    const readCall = fetch.mock.calls.find((call) =>
      call[0].includes("read")
    );
    expect(readCall).toBeDefined();
  });
});
