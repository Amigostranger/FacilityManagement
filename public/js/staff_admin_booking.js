

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



async function loadBookings() {
    bookingsTableBody.innerHTML = "";

    const bookings=await fetch("http://localhost:3000/api/staff-bookings");
    

}




// Format timestamp to readable date
// function formatTimestamp(timestamp) {
//     if (!timestamp) return "-";
//     const date = new Date(timestamp.seconds * 1000);
//     return date.toLocaleString();
//   }






