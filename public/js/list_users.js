// Replace ES module imports with require statements
const fetch = require('node-fetch'); // Or another fetch polyfill, if needed

let usersarr = [];

async function loadUsers() {
  const response = await fetch('https://sports-facility-management-web-app.azurewebsites.net/api/get-users');
  const data = await response.json();
  usersarr = data; 
  const tbody = document.getElementById("userTableBody");
  tbody.innerHTML = ""; 

  usersarr.forEach(users => {
    if(users.role !== 'admin' && users.role !== "Admin"){
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${users.email || "N/A"}</td>
        <td>${users.role || "None"}</td>
        <td>
          <select data-id="${users.id}" class="roleSelector">
            <option value="">-- Select --</option>
            <option value="Resident">Resident</option>
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </select>
        </td>
        <td>
          <button class="deleteBtn" data-id="${users.id}">Revoke</button>
        </td>
      `;
      tbody.appendChild(row);
    }
  });

  attachListeners();
}

function attachListeners() {
  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', deleteIT);
  });

  document.querySelectorAll(".roleSelector").forEach(it => {
    it.addEventListener('change', talkToit);
  });
}

async function talkToit(event) {
  const selectedvalue = event.target.value;
  const userId = event.target.getAttribute('data-id');
  const newRole = event.target.value;

  if (!newRole) {
    return;
  }

  if (!confirm(`Are you sure you want to change role to ${newRole}?`)) {
    return;
  }

  try {
    const response = await fetch(`https://sports-facility-management-web-app.azurewebsites.net/api/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role: newRole })
    });

    const result = await response.json();
    if (response.ok) {
      const user = usersarr.find(u => u.id === userId);
      if (user) {
        user.role = newRole;
        loadUsers();
      }
    } else {
      console.error(result.error || 'Failed to update');
    }
  } catch (error) {
    console.error(error);
  }
}

async function deleteIT(event) {
  const userId = event.target.getAttribute('data-id');
  
  if (!confirm('Confirm to revoke access of user?')) {
    return;
  }

  try {
    const response = await fetch(`https://sports-facility-management-web-app.azurewebsites.net/api/user/${userId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (response.ok) {
      loadUsers();
    } else {
      console.error('Failed to delete user');
    }
  } catch (error) {
    console.error(error);
  }
}

// Export functions for testing
module.exports = {
  loadUsers,
  talkToit,
  deleteIT
};
