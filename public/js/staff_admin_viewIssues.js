// staff_admin_viewIssues.js

import { db } from '../../utils/firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// View single issue in modal
export async function handleView(e, modal, descriptionPara, statusSelect, feedbackInput, setCurrentIssueId) {
  const issueId = e.target.dataset.id;
  const issueRef = doc(db, "Issues", issueId);
  const issueSnap = await getDoc(issueRef);

  if (!issueSnap.exists()) return;

  const issue = issueSnap.data();

  setCurrentIssueId(issueId);
  descriptionPara.textContent = issue.description || "No description.";
  statusSelect.value = issue.status || "Pending";
  feedbackInput.value = issue.feedback || "";

  modal.hidden = false;
}

// Load all issues into a table
export async function loadIssues(tableBody, handleViewWrapper) {
  try {
    const response = await fetch("https://sports-management.azurewebsites.net/api/issues/all");
    const data = await response.json();

    if (!data.success) throw new Error("Failed to fetch issues.");

    tableBody.innerHTML = "";

    data.issues.forEach(issue => {
      const tr = document.createElement("tr");

      const viewBtn = document.createElement("button");
      viewBtn.textContent = "View";
      viewBtn.type = "button";
      viewBtn.className = "viewBtn";
      viewBtn.dataset.id = issue.id;
      viewBtn.addEventListener("click", handleViewWrapper);

      tr.innerHTML = `
        <td>${issue.username || 'Unknown'}</td>
        <td>${issue.title}</td>
        <td>${issue.status}</td>
        <td></td>
      `;
      tr.children[3].appendChild(viewBtn);
      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading issues:", err);
    alert("Could not load issues.");
  }
}
