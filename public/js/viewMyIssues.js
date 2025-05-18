// public/js/viewMyIssues.js

import { auth } from '../../utils/firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { loadIssues } from './viewMyIssuesLogic.js';

const tableBody = document.getElementById("issuesTable");
const viewDescription = document.getElementById("issueDescription");
const viewFeedback = document.getElementById("feedback");
const closeViewBtn = document.getElementById("closeViewBtn");
const viewModal = document.getElementById("viewModal");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is signed in:", user.email);
    await loadIssues(user, tableBody, viewDescription, viewFeedback, viewModal);
  } else {
    console.log("No user signed in");
    alert("You need to be signed in to view issues.");
  }
});

viewModal.addEventListener("click", (e) => {
  if (e.target === viewModal) {
    viewModal.hidden = true;
  }
});

closeViewBtn.addEventListener("click", () => {
  viewModal.hidden = true;
});
