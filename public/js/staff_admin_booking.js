



import { getUser } from './getUsersfun.js';
import { fetchBookings, updateBookingStatus } from './getBookingFun.js';

// DOM Elements
const bookingsTableBody = document.querySelector('#bookingsTable tbody');
const bookingModal = document.getElementById('bookingModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalFacility = document.getElementById('modalFacility');
const modalStart = document.getElementById('modalStart');
const modalEnd = document.getElementById('modalEnd');
const statusSelect = document.getElementById('statusSelect'); // Not used but kept in case
const saveStatusBtn = document.getElementById('saveStatusBtn');
const cancelBtn = document.getElementById('cancelBtn');
const sec = document.getElementById('drop');

let selectedBookingId = "";

// Load and display bookings
async function loadBookings() {
  bookingsTableBody.innerHTML = "";
  bookingModal.hidden = true;

  const bookings = await fetchBookings();

  for (const book of bookings) {
    const user = await getUser(book.submittedBy);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user}</td>
      <td>${book.title || "None"}</td>
      <td><button class="viewBtn" data-id="${book.bookId}">View</button></td>
    `;
    bookingsTableBody.appendChild(row);
  }

  attachListeners(bookings);
}

// Attach click listeners to view buttons
function attachListeners(bookarr) {
  document.querySelectorAll('.viewBtn').forEach(btn => {
    btn.addEventListener('click', (event) => view(event, bookarr));
  });
}

// Show modal and populate it with booking details
function view(event, bookarr) {
  bookingModal.hidden = false;
  const bookId = event.target.getAttribute('data-id');
  const booking = bookarr.find(b => b.bookId === bookId);

  if (!booking) return;

  modalTitle.textContent = booking.title || "Untitled";
  modalDescription.textContent = booking.description || "No description";

  const startDate = new Date(booking.start._seconds * 1000);
  const endDate = new Date(booking.end._seconds * 1000);
  modalStart.textContent = startDate.toLocaleString();
  modalEnd.textContent = endDate.toLocaleString();
  modalFacility.textContent = booking.facility;

  sec.innerHTML = "";
  const dropdown = document.createElement('select');
  dropdown.className = 'bookselector';
  dropdown.setAttribute('data-id', bookId);

  const defaultOption = document.createElement('option');
  defaultOption.value = "";
  defaultOption.textContent = "-- Select --";
  dropdown.appendChild(defaultOption);

  ["Pending", "Approve", "Decline"].forEach(label => {
    const option = document.createElement('option');
    option.textContent = label;
    if (label === "Approve") option.value = "Approved";
    else if (label === "Decline") option.value = "Declined";
    else option.value = label;
    dropdown.appendChild(option);
  });

  dropdown.addEventListener('change', () => {
    selectedBookingId = bookId;
  });

  sec.appendChild(dropdown);
}

// Save status change
saveStatusBtn.addEventListener("click", async () => {
  const dropdown = sec.querySelector('select');
  const newStatus = dropdown.value;
  bookingModal.hidden = true;

  if (newStatus) {
    await updateBookingStatus(selectedBookingId, newStatus);
    await loadBookings(); // Refresh list
  } else {
    console.error('No status selected');
  }
});

// Cancel modal
cancelBtn.addEventListener("click", () => {
  bookingModal.hidden = true;
});

// Load data on page load
loadBookings();


