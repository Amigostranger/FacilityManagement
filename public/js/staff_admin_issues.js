import { loadIssues, handleView } from './staff_admin_viewIssues.js';
import { db } from '../../utils/firebase.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


// DOM references
const tableBody = document.querySelector("#issuesTable tbody");
const modal = document.getElementById("issueModal");
const statusSelect = document.getElementById("statusSelect");
const feedbackInput = document.getElementById("feedback");
const cancelBtn = document.getElementById("cancelBtn");
const updateForm = document.getElementById("updateForm");
const descriptionPara = document.getElementById("issueDescription");

let currentIssueId = null;
const setCurrentIssueId = (id) => currentIssueId = id;

// Wrap handleView to inject required DOM refs and setter
const handleViewWrapper = (e) => handleView(e, modal, descriptionPara, statusSelect, feedbackInput, setCurrentIssueId);

// Submit updated feedback/status
updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentIssueId) return;

  await updateDoc(doc(db, "Issues", currentIssueId), {
    status: statusSelect.value,
    feedback: feedbackInput.value
  });

  modal.hidden = true;
  currentIssueId = null;
  loadIssues(tableBody, handleViewWrapper);
});

cancelBtn.addEventListener("click", () => {
  modal.hidden = true;
  currentIssueId = null;
});

// Initial load
loadIssues(tableBody, handleViewWrapper);
