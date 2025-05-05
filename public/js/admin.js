
// admin.js
const managebtn=document.getElementById('usersBtn');

managebtn.addEventListener('click',async(e)=>{

    e.preventDefault();
    window.location.href="./list_users.html";


});

document.getElementById("reportBtn").addEventListener("click", () => {
    window.location.href = "./staff_admin_issues.html"; 
  });
  document.getElementById("bookingsBtn").addEventListener("click", () => {
    window.location.href = "./staff_admin_booking.html"; 
  });



//---------------------------------------------------------------------------------------------------------------// 

import { auth } from './firebase.js';

const eventBtn = document.getElementById('eventBtn');
const Modal = document.getElementById('addModal');
const cancelBtn = document.getElementById('cancelEventBtn');
const bookingForm = document.getElementById('bookingForm');

// Show modal
eventBtn.addEventListener('click', () => {
  Modal.hidden = false;
});

// Hide modal
cancelBtn.addEventListener('click', () => {
  Modal.hidden = true;
});

// Submit form
bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById("bookingTitle").value.trim();
  const description = document.getElementById("bookingDescription").value.trim();
  const facility = document.getElementById("facilitySelect").value.trim();
  const date = document.getElementById("bookingDate").value.trim();
  const startTime = document.getElementById("startTime").value.trim();
  const endTime = document.getElementById("endTime").value.trim();
  const who = "admin";

  // Construct consistent datetime strings
  const start = `${date}T${startTime}:00`; // e.g. "2025-05-04T10:00:00"
  const end = `${date}T${endTime}:00`;

  const user = auth.currentUser;
  if (!user) {
    alert("Please log in first.");
    return;
  }

  try {
    const idToken = await user.getIdToken();

    const res = await fetch("http://localhost:3000/api/createEvent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      },
      body: JSON.stringify({ title, description, facility, start, end, who })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Event submitted successfully!");
      bookingForm.reset();
      Modal.hidden = true;
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    console.error("Failed to submit:", err);
    alert("Something went wrong. Please try again.");
  }
});

