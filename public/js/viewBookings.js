import { auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const tableBody = document.querySelector("#bookingsTable tbody");
const bookingsTable = document.getElementById("bookingsTable");
const noBookingsMessage = document.getElementById("noBookingsMessage");
const bookingDetails = document.getElementById("bookingDetails");
const viewModal = document.getElementById("viewModal");
const closeViewBtn = document.getElementById("closeViewBtn");

// Initialize bookings view
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("viewBookingsBtn").addEventListener("click", () => loadBookings(user));
  } else {
    alert("Please sign in to view bookings");
  }
});

async function loadBookings(user) {
  try {
    const token = await user.getIdToken();
    const response = await fetch("https://sports-management.azurewebsites.net/api/bookings", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!response.ok) throw new Error(await response.text());
    
    const { bookings } = await response.json();
    renderBookings(bookings);
  } catch (error) {
    console.error("Booking load error:", error);
    noBookingsMessage.hidden = false;
    bookingsTable.hidden = true;
  }
}

function renderBookings(bookings) {
  tableBody.innerHTML = "";
  
  if (!bookings || bookings.length === 0) {
    noBookingsMessage.hidden = false;
    bookingsTable.hidden = true;
    return;
  }

  noBookingsMessage.hidden = true;
  bookingsTable.hidden = false;

  bookings.forEach(booking => {
    const row = document.createElement("tr");
    const startDate = booking.start.toDate ? booking.start.toDate() : new Date(booking.start);
    const endDate = booking.end.toDate ? booking.end.toDate() : new Date(booking.end);

    row.innerHTML = `
      <td>${booking.title || 'No title'}</td>
      <td>${booking.facility}</td>
      <td>${startDate.toLocaleDateString()}</td>
      <td>${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
      <td>${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
    `;

    row.addEventListener("click", () => showBookingDetails(booking));
    tableBody.appendChild(row);
  });
}

function showBookingDetails(booking) {
  const startDate = booking.start.toDate ? booking.start.toDate() : new Date(booking.start);
  const endDate = booking.end.toDate ? booking.end.toDate() : new Date(booking.end);

  bookingDetails.innerHTML = `
    <h3>${booking.title || 'No title'}</h3>
    <p><strong>Facility:</strong> ${booking.facility}</p>
    <p><strong>Date:</strong> ${startDate.toLocaleDateString()}</p>
    <p><strong>Time:</strong> ${startDate.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}</p>
    <p><strong>Status:</strong> ${booking.status || 'Pending'}</p>
    <p><strong>Description:</strong> ${booking.description || 'No description'}</p>
  `;
  viewModal.hidden = false;
}

// Modal handlers
viewModal.addEventListener("click", (e) => e.target === viewModal && (viewModal.hidden = true));
closeViewBtn.addEventListener("click", () => viewModal.hidden = true);