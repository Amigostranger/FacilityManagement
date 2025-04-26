// Elements
const addBookingBtn = document.getElementById('addBookingBtn');
const viewBookingsBtn = document.getElementById('viewBookingsBtn');
const addModal = document.getElementById('addModal');
const viewModal = document.getElementById('viewModal');
const cancelBookingBtn = document.getElementById('cancelBookingBtn');
const closeViewBtn = document.getElementById('closeViewBtn');
const bookingsTable = document.getElementById('bookingsTable');

// Hide the table by default
bookingsTable.hidden = true;

// Show "Add Booking" modal
addBookingBtn.addEventListener('click', () => {
  addModal.hidden = false;
});

// Hide "Add Booking" modal
cancelBookingBtn.addEventListener('click', () => {
  addModal.hidden = true;
});

// Show "View My Bookings" modal + table
viewBookingsBtn.addEventListener('click', () => {
  viewModal.hidden = false;
  bookingsTable.hidden = false;
});

// Hide "View My Bookings" modal
closeViewBtn.addEventListener('click', () => {
  viewModal.hidden = true;
  bookingsTable.hidden = true;
});
