import { revokeUser } from './revokeFun.js';

export function renderUsers(users) {
  const tbody = document.getElementById("userTableBody");
  tbody.innerHTML = "";

  users.forEach(user => {
    const role = user.role?.toLowerCase();
    if (role !== 'admin' && role !== 'staff') {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${user.email || "N/A"}</td>
        <td><button class="deleteBtn" data-id="${user.id}">Revoke</button></td>
      `;

      tbody.appendChild(row);
    }
  });

  attachDeleteListeners();
}

function attachDeleteListeners() {
  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', async (event) => {
      const userId = event.target.getAttribute('data-id');
      if (!confirm('Confirm to revoke access of this resident?')) return;

      try {
        await revokeUser(userId);
        alert("User revoked successfully");
        window.dispatchEvent(new Event("usersChanged"));
      } catch (err) {
        alert("Failed to revoke user");
      }
    });
  });
}
