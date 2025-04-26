import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBLsT0OJXoEha8ZKGCZaHgyht5eZ21O-mQ",
  authDomain: "sportsmanagement-a0f0b.firebaseapp.com",
  projectId: "sportsmanagement-a0f0b",
  storageBucket: "sportsmanagement-a0f0b.appspot.com",
  messagingSenderId: "674114167483",
  appId: "1:674114167483:web:e8c57868dcf8bccfce3f9e"
};

// Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elements
const bookingsTableBody = document.querySelector('#bookingsTable tbody');
const bookingModal = document.getElementById('bookingModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalFacility = document.getElementById('modalFacility');
const modalStart = document.getElementById('modalStart');
const modalEnd = document.getElementById('modalEnd');
const statusSelect = document.getElementById('statusSelect');
const saveStatusBtn = document.getElementById('saveStatusBtn');
const cancelBtn = document.getElementById('cancelBtn');

let selectedBookingId = null;

// Format timestamp to readable date
function formatTimestamp(timestamp) {
    if (!timestamp) return "-";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  }

// Fetch bookings
async function loadBookings() {
  bookingsTableBody.innerHTML = "";

  const bookingRef = collection(db, "bookings"); 
  const snapshot = await getDocs(bookingRef);

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${data.submittedBy || '-'}</td>
      <td>${data.Title || '-'}</td>
      <td><button class="statusBtn" onclick="openModal('${docSnap.id}', '${data.Title}', '${data.Description}', '${data.facility}', '${formatTimestamp(data.start)}', '${formatTimestamp(data.end)}', '${data.status}')">View</button></td>
    `;

    bookingsTableBody.appendChild(row);
  });
}

// Expose openModal globally
window.openModal = function(id, title, description, facility, start, end, status) {
  selectedBookingId = id;
  modalTitle.textContent = title;
  modalDescription.textContent = description;
  modalFacility.textContent = facility || '-';
  modalStart.textContent = new Date(start).toLocaleString() || '-';
  modalEnd.textContent = new Date(end).toLocaleString() || '-';

  // Set status
  statusSelect.value = status || 'pending';

  bookingModal.hidden = false;
};

// Save the selected status
saveStatusBtn.addEventListener('click', async () => {
  const newStatus = statusSelect.value;

  if (!newStatus) {
    alert("Please select Accept or Reject.");
    return;
  }

  if (selectedBookingId) {
    const bookingDoc = doc(db, "bookings", selectedBookingId);

    await updateDoc(bookingDoc, {
      status: newStatus
    });

    alert(`Booking marked as ${newStatus}`);
    bookingModal.hidden = true;
    loadBookings();
  }
});

// Cancel modal
cancelBtn.addEventListener('click', () => {
  bookingModal.hidden = true;
});

// Load bookings on page load
loadBookings();
