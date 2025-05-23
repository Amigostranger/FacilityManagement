// Firebase setup
import { loadIssues, handleView } from './staff_admin_viewIssues.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


import { db, auth } from '../../utils/firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// DOM references
const tableBody = document.querySelector("#issuesTable tbody");
const modal = document.getElementById("issueModal");
const statusSelect = document.getElementById("statusSelect");
const feedbackInput = document.getElementById("feedback");
const cancelBtn = document.getElementById("cancelBtn");
const updateForm = document.getElementById("updateForm");
const descriptionPara = document.getElementById("issueDescription");

let currentIssueId = null;
const setCurrentIssueId = (id) => currentIssueId = id;
let currentUserRole = null;

// Check user authentication and role
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, get their role
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      currentUserRole = userDoc.data().role; // Assuming role is stored in user document
      localStorage.setItem('userRole', currentUserRole);
      setupNavigation();
    }
  } else {
    // User is signed out
    window.location.href = "./login_page.html";
  }
});

// Wrap handleView to inject required DOM refs and setter
const handleViewWrapper = (e) => handleView(e, modal, descriptionPara, statusSelect, feedbackInput, setCurrentIssueId);

// Submit updated feedback/status
updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentIssueId) return;

  await updateDoc(doc(db, "Issues", currentIssueId), {
    status: statusSelect.value,
    feedback: feedbackInput.value
  });

  modal.hidden = true;
  currentIssueId = null;
  loadIssues(tableBody, handleViewWrapper);
});

cancelBtn.addEventListener("click", () => {
  modal.hidden = true;
  currentIssueId = null;
});

// Initial load
loadIssues(tableBody, handleViewWrapper);
function setupNavigation() {
  // Navigation configuration for different roles
  const navConfig = {
    admin: [
      { id: 'homeBtn', path: './admin_home.html', text: 'Home' },
      { id: 'reportsBtn', path: './reports_dashboard.html', text: 'Reports' },
      { id: 'manageBtn', path: './list_users.html', text: 'Manage Users' },
      { id: 'bookBtn', path: './staff_admin_booking.html', text: 'Bookings' }
    ],
    staff: [
      { id: 'homeBtn', path: './staff_home.html', text: 'Home' },
      { id: 'bookBtn', path: './staff_admin_booking.html', text: 'Bookings' },
      { id: 'residentsBtn', path: './list_residents.html', text: 'Residents' },
      { id: 'reportsBtn', path: './reports_dashboard.html', text: 'Reports' }
    ]
  };

  // Get the navbar element
  const navbar = document.querySelector('.navbar');
  
  if (!navbar) return;

  // Clear existing navbar buttons
  navbar.innerHTML = '';

  // Get the appropriate navigation config based on role
  const role = currentUserRole || localStorage.getItem('userRole') || 'staff';
  const config = navConfig[role] || navConfig.staff;

  // Create buttons based on user role
  config.forEach(item => {
    const button = document.createElement('button');
    button.id = item.id;
    button.textContent = item.text;
    
    button.addEventListener('click', () => {
      window.location.href = item.path;
    });
    
    // Keyboard accessibility
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        window.location.href = item.path;
      }
    });
    
    navbar.appendChild(button);
  });

  // Add active state tracking
  const currentPage = window.location.pathname.split('/').pop();
  config.forEach(item => {
    const button = document.getElementById(item.id);
    if (button && item.path.includes(currentPage)) {
      button.classList.add('active-nav-button');
    }
  });
}
