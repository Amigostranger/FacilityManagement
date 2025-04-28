// viewMyIssues.js

import { auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const tableBody = document.getElementById("issuesTable");
const viewDescription = document.getElementById("issueDescription");
const viewFeedback = document.getElementById("feedback");
const closeViewBtn = document.getElementById("closeViewBtn");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is signed in:", user.email);
    await loadIssues(user);
  } else {
    console.log("No user signed in");
    alert("You need to be signed in to view issues.");
  }
});

async function loadIssues(user) {
  try {
    const token = await user.getIdToken();

    const res = await fetch("https://sports-management.azurewebsites.net/api/issues", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    const issues = data.issues;
    //const issues = await res.json();
    //tableBody.innerHTML = "";
    console.log(issues);
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
    console.log("Something is wrong");
    console.error("Error loading issues:", err);
  }
}

viewModal.addEventListener("click", (e) => {
  if (e.target === viewModal) {
    viewModal.hidden = true;
  }
});

closeViewBtn.addEventListener("click", () => {
  viewModal.hidden = true;
});
