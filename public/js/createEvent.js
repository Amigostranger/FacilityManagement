import { auth } from '../../utils/firebase.js';
import { postEvent } from './postEvent.js'; 


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



  const { res, data } = await postEvent({ user, title, description, facility, start, end, who });

  if (res.ok) {
    alert("Event submitted successfully!");
    bookingForm.reset();
    Modal.hidden = true;
  } else {
    alert("Error: " + data.error);
  }


});