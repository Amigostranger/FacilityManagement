import { auth } from '../../utils/firebase.js';

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
  const description = document.getElementById("issueDescInput").value.trim();
  const facility = document.getElementById("facilitySelect").value.trim();

  const user = auth.currentUser;
  if (!user) {
    alert("Please log in first.");
    return;
  }

  try {
    const idToken = await user.getIdToken();

    const res = await fetch("https://sports-management.azurewebsites.net/api/report", {
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

 document.getElementById("homeBtn").addEventListener("click", () => {
    window.location.href = "./resident_home.html"; 
  });
  document.getElementById("bookBtn").addEventListener("click", () => {
    window.location.href = "./resident_new_booking.html"; 
  });
  document.getElementById("notifyBtn").addEventListener("click", () => {
    window.location.href = "./resident_notifications.html"; 
  });