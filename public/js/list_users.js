// Check user role on page load
document.addEventListener('DOMContentLoaded', async () => {
  const userRole = localStorage.getItem('userRole');
  if (!userRole) {
    window.location.href = 'login.html';
    return;
  }

  // Set page title based on role
  document.getElementById('pageTitle').textContent = 
    userRole === 'ADMIN' ? 'User Management (Admin)' : 'Residents List';

  try {
    const response = await fetch('https://sports-management.azurewebsites.net/api/get-users', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('userToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    await loadUsers(data, userRole);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to load users. Please try again.');
  }
});

async function loadUsers(usersData, currentUserRole) {
  const tbody = document.getElementById("userTableBody");
  const headerRow = document.getElementById("tableHeaderRow");
  tbody.innerHTML = "";
  
  // Set table headers based on role
  if (currentUserRole === 'ADMIN') {
    headerRow.innerHTML = `
      <th>Email</th>
      <th>Role</th>
      <th>Assign Role</th>
      <th>Actions</th>
    `;
  } else {
    headerRow.innerHTML = `
      <th>Email</th>
      <th>Role</th>
    `;
  }

  // Filter users based on role
  const filteredUsers = usersData.filter(user => {
    if (currentUserRole === 'ADMIN') {
      return user.role.toLowerCase() !== 'admin'; // Admins see everyone except other admins
    } else if (currentUserRole === 'STAFF') {
      return user.role.toLowerCase() === 'resident'; // Staff only see residents
    }
    return false;
  });

  // Populate table rows
  filteredUsers.forEach(user => {
    const row = document.createElement("tr");
    
    if (currentUserRole === 'ADMIN') {
      row.innerHTML = `
        <td>${user.email || "N/A"}</td>
        <td>${user.role || "None"}</td>
        <td>
          <select data-id="${user.id}" class="roleSelector">
            <option value="">-- Select --</option>
            <option value="Resident" ${user.role === 'Resident' ? 'selected' : ''}>Resident</option>
            <option value="Staff" ${user.role === 'Staff' ? 'selected' : ''}>Staff</option>
            <option value="Admin" ${user.role === 'Admin' ? 'selected' : ''}>Admin</option>
          </select>
        </td>
        <td>
          <button class="deleteBtn" data-id="${user.id}">Revoke</button>
        </td>
      `;
    } else {
      row.innerHTML = `
        <td>${user.email || "N/A"}</td>
        <td>${user.role || "None"}</td>
      `;
    }
    
    tbody.appendChild(row);
  });

  if (currentUserRole === 'ADMIN') {
    attachListeners();
  }
}

function attachListeners() {
  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', deleteIT);
  });

  document.querySelectorAll(".roleSelector").forEach(select => {
    select.addEventListener('change', talkToit);
  });
}

async function talkToit(event) {
  const newRole = event.target.value;
  const userId = event.target.getAttribute('data-id');

  if (!newRole) return;

  if (!confirm(`Are you sure you want to change role to ${newRole}?`)) {
    return;
  }

  try {
    const response = await fetch(`https://sports-management.azurewebsites.net/api/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('userToken')}`
      },
      body: JSON.stringify({ role: newRole })
    });

    if (response.ok) {
      alert(`Role updated successfully to ${newRole}`);
      location.reload(); // Refresh to show changes
    } else {
      const result = await response.json();
      throw new Error(result.error || 'Failed to update role');
    }
  } catch (error) {
    console.error(error);
    alert('Failed to update role. Please try again.');
  }
}

async function deleteIT(event) {
  const userId = event.target.getAttribute('data-id');
  
  if (!confirm('Confirm to revoke access of user?')) {
    return;
  }

  try {
    const response = await fetch(`https://sports-management.azurewebsites.net/api/user/${userId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('userToken')}`
      }
    });

    if (response.ok) {
      alert('User access revoked successfully');
      location.reload(); // Refresh to show changes
    } else {
      const result = await response.json();
      throw new Error(result.error || 'Failed to revoke access');
    }
  } catch (error) {
    console.error(error);
    alert('Failed to revoke access. Please try again.');
  }
}