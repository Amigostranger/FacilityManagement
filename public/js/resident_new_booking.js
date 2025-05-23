import { auth } from '../../utils/firebase.js';
import { fetchBookings } from './viewBookings.js'
import { submitBooking } from './submitBooking.js';


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
  const isVisible = !bookingsTable.hidden;

  if (isVisible) {
    // Hide table and change button text back
    bookingsTable.hidden = true;
    noBookingsMessage.hidden = true;
    viewBookingsBtn.textContent = "View My Bookings";
  } else {
    // Show table and fetch data
    bookingsTable.hidden = false;
    fetchBookings(bookingsTable, bookingsTableBody, noBookingsMessage);
    viewBookingsBtn.textContent = "Close My Bookings";
  }
});

// Hide "View My Bookings" modal + hide table
closeViewBtn.addEventListener('click', () => {
  viewModal.hidden = true;
  bookingsTable.hidden = true;
});




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

    const bookingData = { title, facility, description, start, end, who };
    const result = await submitBooking(bookingData, idToken);

    if (result.success) {
      alert("Booking added successfully!");
      bookingForm.reset();
      document.getElementById('addModal').hidden = true;
    } else {
      alert("Error: " + result.error);
    }
  } catch (err) {
    console.error("Booking submission failed:", err);
    alert("Something went wrong. Please try again.");
  }
});

