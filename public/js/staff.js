// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Verify staff role
  const userRole = localStorage.getItem('userRole');
  if (userRole !== 'STAFF') {
      window.location.href = 'unauthorized.html';
      return;
  }

  // Button functionality
  

  document.getElementById('reportBtn').addEventListener('click', () => {
      window.location.href = 'staff_admin_issues.html';
  });

  document.getElementById('bookingsBtn').addEventListener('click', () => {
      window.location.href = 'staff_admin_booking.html';
  });

  document.getElementById('usersBtn').addEventListener('click', () => {
      window.location.href = 'staff_residents.html';
  });

  // Profile button functionality
  document.getElementById('userImgBtn').addEventListener('click', () => {
      // Toggle profile dropdown or redirect
      window.location.href = 'staff_profile.html';
  });
});

function initDashboardButtons() {
  // Residents Button - View only residents
  document.getElementById('usersBtn').addEventListener('click', () => {
      window.location.href = 'staff_residents.html'; // New page for resident management
  });

  // Issues Button
  document.getElementById('reportBtn').addEventListener('click', () => {
      window.location.href = 'staff_admin_issues.html';
  });

  // Events Button
  document.getElementById('eventBtn').addEventListener('click', () => {
      window.location.href = 'staff_events.html';
  });

  // Bookings Button
  document.getElementById('bookingsBtn').addEventListener('click', () => {
      window.location.href = 'staff_bookings.html';
  });
}

function showProfileOptions() {
  // Create profile dropdown
  const dropdown = document.createElement('div');
  dropdown.className = 'profile-dropdown';
  dropdown.innerHTML = `
      <button id="viewProfileBtn">View Profile</button>
      <button id="logoutBtn">Logout</button>
  `;
  
  // Position near profile button
  const profileBtn = document.getElementById('userImgBtn');
  dropdown.style.position = 'absolute';
  dropdown.style.top = `${profileBtn.offsetTop + profileBtn.offsetHeight}px`;
  dropdown.style.right = '20px';
  
  document.body.appendChild(dropdown);
  
  // Add dropdown functionality
  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('viewProfileBtn').addEventListener('click', () => {
      window.location.href = 'staff_profile.html';
  });
  
  // Close dropdown when clicking elsewhere
  document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && e.target !== profileBtn) {
          dropdown.remove();
      }
  }, { once: true });
}

async function logout() {
  try {
      await firebase.auth().signOut();
      localStorage.clear();
      window.location.href = 'login.html';
  } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
  }
}