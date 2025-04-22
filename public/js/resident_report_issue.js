import { auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user.email);
  } else {
    console.log("No user signed in");
  }
}); 



// Elements
const newIssueBtn = document.getElementById('newIssueBtn');
const issueModal = document.getElementById('issueModal');
const cancelBtn = document.getElementById('cancelBtn');
const issueForm = document.getElementById('issueForm');

// Show modal
newIssueBtn.addEventListener('click', () => {
  issueModal.hidden = false;
});

// Hide modal
cancelBtn.addEventListener('click', () => {
  issueModal.hidden = true;
});

// Submit form
issueForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById("issueTitle").value.trim();
  const description = document.getElementById("issueDescription").value.trim();
  const facility = document.getElementById("facilitySelect").value.trim();

  const user = auth.currentUser;
  if (!user) {
    alert("Please log in first.");
    return;
  }

  try {
    const idToken = await user.getIdToken();

    const res = await fetch("https://sports-facility-management-web-app.azurewebsites.net/api/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      },
      body: JSON.stringify({ title, description, facility })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Issue submitted successfully!");
      issueForm.reset();
      issueModal.hidden = true;
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    console.error("Failed to submit:", err);
    alert("Something went wrong. Please try again.");
  }
});
