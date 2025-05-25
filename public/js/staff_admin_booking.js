



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
let currentUserRole = null;
import { auth } from '../../utils/firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {

    window.location.replace("/login_page.html");
  }
})
async function initializePage() {
  await checkAuthState();
  setupNavigation(); // <-- this should happen AFTER role is loaded
  await loadBookings(); // <-- also wait for bookings to load
}


// Check authentication state and get user role
async function checkAuthState() {
  try {
    // Get user role from localStorage or default to 'staff'
    currentUserRole = localStorage.getItem('userRole') || 'staff';
  } catch (error) {
    console.error("Error checking auth state:", error);
    currentUserRole = 'staff'; // Default to staff if there's an error
  }
}

// Navigation setup
function setupNavigation() {
  const navConfig = {
    admin: [
      { id: 'homeBtn', path: './admin_home.html', text: 'Home' },
      { id: 'manageBtn', path: './list_users.html', text: 'Manage Users' },
      { id: 'issueBtn', path: './staff_admin_issues.html', text: 'Issues' },
      { id: 'reportsBtn', path: './reports_dashboard.html', text: 'Reports' }
    ],
    staff: [
      { id: 'homeBtn', path: './staff_home.html', text: 'Home' },
      { id: 'residentsBtn', path: './list_residents.html', text: 'Residents' },
      { id: 'bookBtn', path: './staff_admin_issues.html', text: 'Issues' },
      { id: 'reportsBtn', path: './reports_dashboard.html', text: 'Reports' }
    ]
  };

  const navbar = document.querySelector('.navbar');
  if (!navbar) {
    console.error("Navbar element not found");
    return;
  }

  navbar.innerHTML = '';
  const role = currentUserRole || 'staff';
  const config = navConfig[role] || navConfig.staff;

  config.forEach(item => {
    const button = document.createElement('button');
    button.id = item.id;
    button.textContent = item.text;
    
    button.addEventListener('click', () => {
      window.location.href = item.path;
    });
    
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        window.location.href = item.path;
      }
    });
    
    navbar.appendChild(button);
  });

  // Highlight current page
  const currentPage = window.location.pathname.split('/').pop();
  config.forEach(item => {
    const button = document.getElementById(item.id);
    if (button && item.path.includes(currentPage)) {
      button.classList.add('active-nav-button');
    }
  });
}

async function getuser(id) {
  console.log(id);
  const response = await fetch(`https://sports-management.azurewebsites.net/api/get-users`);
  const data = await response.json();
  const spec = data.find(u => u.id === id);
  return spec ? spec.username : "N/A";//
}


// Load and display bookings
async function loadBookings() {
  bookingsTableBody.innerHTML = "";
  bookingModal.hidden = true;

  const bookings = await fetchBookings();

  for (const book of bookings) {//check what user does
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
  document.querySelectorAll('.viewBtn').forEach(btn => {
    btn.addEventListener('click', (event) => view(event, bookarr));
  });
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
//loadBookings();

// Load data on page load
initializePage(); // <-- use this



