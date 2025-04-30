import { auth } from './firebase.js';
import { db } from './firebase.js';
// import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { collection, query, where, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";



// Elements
const addBookingBtn = document.getElementById('addBookingBtn');
const viewBookingsBtn = document.getElementById('viewBookingsBtn');
const viewFilteredBtn = document.getElementById('viewFilteredBtn');
const addModal = document.getElementById('addModal');
const viewModal = document.getElementById('viewModal');
const cancelBookingBtn = document.getElementById('cancelBookingBtn');
const closeViewBtn = document.getElementById('closeViewBtn');
const bookingsTable = document.getElementById('bookingsTable');
const bookingsTableBody = document.querySelector('#bookingsTable tbody');
const facilityFilter = document.getElementById('facilityFilter');
const dateFilter = document.getElementById('dateFilter');
const noBookingsMessage = document.getElementById('noBookingsMessage');


// Hide the table and modals by default
bookingsTable.hidden = true;
addModal.hidden = true;
viewModal.hidden = true;
noBookingsMessage.hidden = true;

// Show "Add Booking" modal
addBookingBtn.addEventListener('click', () => {
  addModal.hidden = false;
});

// Hide "Add Booking" modal
cancelBookingBtn.addEventListener('click', () => {
  addModal.hidden = true;
});

// Show "View My Bookings" modal + table and fetch bookings
viewBookingsBtn.addEventListener('click', () => {
  viewModal.hidden = false;
  bookingsTable.hidden = false;
  fetchBookings();
});

// Hide "View My Bookings" modal + hide table
closeViewBtn.addEventListener('click', () => {
  viewModal.hidden = true;
  bookingsTable.hidden = true;
});

// Fetch and display user's own bookings
async function fetchBookings() {
  bookingsTableBody.innerHTML = ""; // Clear old bookings

  const user = auth.currentUser;
  if (user) {
    const submittedBy = user.email;
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("submittedBy", "==", submittedBy));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      bookingsTable.hidden = true;
      noBookingsMessage.hidden = false;
    } else {
      noBookingsMessage.hidden = true;
      bookingsTable.hidden = false;
      querySnapshot.forEach((doc) => {
        const booking = doc.data();
        const startDate = booking.start.toDate();
        const endDate = booking.end.toDate();

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${booking.Title}</td>
          <td>${booking.facility || '-'}</td>
          <td>${startDate.toLocaleDateString()}</td>
          <td>${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
          <td>${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
        `;
        bookingsTableBody.appendChild(row);
      });
    }
  } else {
    alert("You must be logged in to view bookings.");
  }
}



const bookingForm = document.getElementById('bookingForm');

// Submit booking form
bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('bookingTitle').value.trim();
  const facility = document.getElementById('facilitySelect').value.trim();
  const description = document.getElementById('bookingDescription').value.trim();
  const date = document.getElementById('bookingDate').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;

  if (!date || !startTime || !endTime) {
    alert("Please fill in date, start time, and end time.");
    return;
  }

  const start = new Date(`${date}T${startTime}`).toISOString();
  const end = new Date(`${date}T${endTime}`).toISOString();

  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to book.");
    return;
  }

  try {
    const idToken = await user.getIdToken();

    const who = "resident";
    
    // Send booking details to server
    
    const res = await fetch("https://sports-management.azurewebsites.net/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      },
      body: JSON.stringify({ title, description, facility, start, end, who })
    });

    const data = await res.json();
    
    if (res.ok) {
      alert("Booking added successfully!");
      bookingForm.reset();
      addModal.hidden = true;
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    console.error("Failed to submit booking:", err);
    alert("Something went wrong. Please try again.");
  }
});