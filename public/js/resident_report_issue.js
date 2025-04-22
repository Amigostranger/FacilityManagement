import { auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// DOM Elements
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

// Wait for Firebase to confirm if user is signed in
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user.email);

    issueForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = document.getElementById("issueTitle").value.trim();
      const description = document.getElementById("issueDisc").value.trim();
      const facility = document.getElementById("facilitySelect").value.trim();

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

  } else {
    console.log("No user signed in");
    alert("Please sign in first.");
  }
});
