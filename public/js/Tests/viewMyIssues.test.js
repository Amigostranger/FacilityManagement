/**
 * @jest-environment jsdom
 */

import { loadIssues } from '../viewMyIssuesLogic.js';

// Mock fetch response
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        issues: [
          {
            title: "Leaky pipe",
            description: "Maintenance needed in locker room",
            feedback: "Plumber assigned",
            status: "In Progress"
          }
        ]
      })
  })
);

describe("loadIssues", () => {
  let user;

  let tableBody, viewDescription, viewFeedback, viewModal;

  beforeEach(() => {
    document.body.innerHTML = `
      <table><tbody id="issuesTable"></tbody></table>
      <div id="issueDescription"></div>
      <div id="feedback"></div>
      <div id="viewModal" hidden></div>
    `;

    tableBody = document.getElementById("issuesTable");
    viewDescription = document.getElementById("issueDescription");
    viewFeedback = document.getElementById("feedback");
    viewModal = document.getElementById("viewModal");

    user = {
      getIdToken: jest.fn().mockResolvedValue("mock-token")
    };
  });

  it("renders an issue row", async () => {
    await loadIssues(user, tableBody, viewDescription, viewFeedback, viewModal);
    const row = document.querySelector("#issuesTable tr");
    expect(row).not.toBeNull();
    expect(row.innerHTML).toContain("Leaky pipe");
    expect(row.innerHTML).toContain("In Progress");
  });

  it("shows modal and sets text on view button click", async () => {
    await loadIssues(user, tableBody, viewDescription, viewFeedback, viewModal);

    const viewBtn = document.querySelector(".actionBtn");
    viewBtn.click();

    expect(viewDescription.textContent).toBe("Maintenance needed in locker room");
    expect(viewFeedback.textContent).toBe("Plumber assigned");
    expect(viewModal.hidden).toBe(false);
  });
});
