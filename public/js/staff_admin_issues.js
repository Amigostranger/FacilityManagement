// Firebase setup
import { db, auth } from '../../utils/firebase.js';
import { collection, getDocs, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
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
      loadIssues();
    }
  } else {
    // User is signed out
    window.location.href = "./login_page.html";
  }
});

// Load issues and usernames
async function loadIssues() {
  const issuesSnapshot = await getDocs(collection(db, "Issues"));
  tableBody.innerHTML = "";

  for (const issueDoc of issuesSnapshot.docs) {
    const issueData = issueDoc.data();
    const issueId = issueDoc.id;
    const submittedBy = issueData.submittedBy;

    // Fetch the user's username
    const userDoc = await getDoc(doc(db, "users", submittedBy));
    const username = userDoc.exists() ? userDoc.data().username : "Unknown";

    // Create a new row
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${username}</td>
      <td>${issueData.title}</td>
      <td><button class="viewBtn" data-id="${issueId}">View</button></td>
    `;
    tableBody.appendChild(tr);
  }

  // Add event listeners to all view buttons
  document.querySelectorAll(".viewBtn").forEach(btn =>
    btn.addEventListener("click", handleView)
  );
}

// Open modal and show issue details
async function handleView(e) {
  const issueId = e.target.dataset.id;
  const issueRef = doc(db, "Issues", issueId);
  const issueSnap = await getDoc(issueRef);

  if (!issueSnap.exists()) return;

  const issue = issueSnap.data();

  currentIssueId = issueId;
  descriptionPara.textContent = issue.description || "No description.";
  statusSelect.value = issue.status || "Pending";
  feedbackInput.value = issue.feedback || "";

  modal.hidden = false;
}

// Submit updated status and feedback
updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentIssueId) return;

  await updateDoc(doc(db, "Issues", currentIssueId), {
    status: statusSelect.value,
    feedback: feedbackInput.value
  });

  modal.hidden = true;
  currentIssueId = null;
  loadIssues(); // Refresh table
});

// Cancel button hides modal
cancelBtn.addEventListener("click", () => {
  modal.hidden = true;
  currentIssueId = null;
});

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