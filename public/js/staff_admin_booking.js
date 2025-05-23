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
const sec = document.getElementById("drop");
let selectedBookingId = "";
let currentUserRole = null;

// Initialize the page
async function initializePage() {
  await checkAuthState();
  setupNavigation();
  loadBookings();
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
      { id: 'bookBtn', path: './staff_admin_booking.html', text: 'Bookings' },
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
  return spec ? spec.username : "N/A";
}

async function loadBookings() {
  bookingsTableBody.innerHTML = "";
  bookingModal.hidden = true;
  const bookings = await fetch("https://sports-management.azurewebsites.net/api/staff-bookings");
  const data = await bookings.json();
  let bookarr = [];

  if (data) {
    bookarr = data;
  }

  for (const book of bookarr) {
    const user = await getuser(book.submittedBy);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user || "N/A"}</td>
      <td>${book.title || "None"}</td>
      <td>
        <button class="viewBtn" data-id="${book.bookId}">View</button>
      </td>
    `;
    bookingsTableBody.appendChild(row);
  }

  attachListeners(bookarr);
}

function attachListeners(bookarr) {
  document.querySelectorAll('.viewBtn').forEach(btn => {
    btn.addEventListener('click', (event) => view(event, bookarr));
  });
}

function view(event, bookarr) {
  bookingModal.hidden = false;
  const bookidd = event.target.getAttribute('data-id');
  const specificBooking = bookarr.find(booking => booking.bookId === bookidd);
  modalTitle.textContent = specificBooking.Title;
  modalDescription.textContent = specificBooking.Description;

  const startDate = new Date(specificBooking.start._seconds * 1000);
  const endDate = new Date(specificBooking.end._seconds * 1000);

  modalStart.textContent = startDate.toLocaleString();
  modalEnd.textContent = endDate.toLocaleString();
  modalFacility.textContent = specificBooking.facility;
  sec.innerHTML = "";

  const dropdown = document.createElement('select');
  dropdown.className = 'bookselector';
  dropdown.setAttribute('data-id', bookidd);
  
  const defaultOption = document.createElement('option');
  defaultOption.value = "";
  defaultOption.textContent = "-- Select --";
  dropdown.appendChild(defaultOption);

  ["Pending", "Approve", "Decline"].forEach(state => {
    const option = document.createElement('option');
    if (state === "Approve") {
      option.value = "Approved";
    } else if (state === "Decline") {
      option.value = "Declined";
    }
    option.textContent = state;
    dropdown.appendChild(option);
  });

  dropdown.addEventListener('change', () => {
    selectedBookingId = bookidd;
  });

  sec.appendChild(dropdown);
}

saveStatusBtn.addEventListener("click", async () => {
  const dropdown = sec.querySelector('select');
  const newStatus = dropdown.value;
  bookingModal.hidden = true;

  if (newStatus) {
    await updateStatus(selectedBookingId, newStatus);
    bookingModal.hidden = true;
  } else {
    console.error('No status selected');
  }
});

cancelBtn.addEventListener("click", () => {
  bookingModal.hidden = true;
});

async function updateStatus(bookId, newStatus) {
  const sendIT = await fetch(`https://sports-management.azurewebsites.net/api/booking-status/${bookId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ bookId, status: newStatus })
  });

  if (sendIT.ok) {
    console.log(`status changed to ${newStatus}`);
    await loadBookings();
  } else {
    console.error("Error updating status");
    const errorText = await sendIT.text();
    console.error("Error:", errorText);
  }
}

// Start the application
initializePage();