// public/js/viewMyIssuesLogic.js

export async function fetchIssues(user, tableBody, viewDescription, viewFeedback, viewModal) {
  try {
    const token = await user.getIdToken();

    const res = await fetch("https://sports-management.azurewebsites.net/api/issues", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const { issues } = await res.json();

    issues.forEach(issue => {
      const row = document.createElement("tr");

      const viewBtn = document.createElement("button");
      viewBtn.textContent = "View";
      viewBtn.type = "button";
      viewBtn.className = "actionBtn";
      viewBtn.addEventListener("click", () => {
        viewDescription.textContent = issue.description || "No description.";
        viewFeedback.textContent = issue.feedback || "No feedback yet.";
        viewModal.hidden = false;
      });

      row.innerHTML = `
        <td>${issue.title}</td>
        <td></td>
        <td>${issue.status}</td>`;
      row.children[1].appendChild(viewBtn);

      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading issues:", err);
  }
}
