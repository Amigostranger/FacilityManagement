// adminRevokeDom.js
import { fetchAdminUsers, revokeAdminUser, updateUserRole } from './adminRevokeFun.js';

export async function renderAdminUsers() {
  const tbody = document.getElementById("userTableBody");
  tbody.innerHTML = "";

  const users = await fetchAdminUsers();

  users.forEach(user => {
    if (user.role?.toLowerCase() !== 'admin') {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${user.username || "N/A"}</td>
        <td>${user.role || "None"}</td>
        <td>
          <select data-id="${user.id}" class="roleSelector">
            <option value="">-- Select --</option>
            <option value="Resident">Resident</option>
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </select>
        </td>
        <td>
          <button class="revokeBtn" data-id="${user.id}">Revoke</button>
        </td>
      `;

      tbody.appendChild(row);
    }
  });

  attachAdminListeners();
}

function attachAdminListeners() {
  document.querySelectorAll('.revokeBtn').forEach(btn => {
    btn.addEventListener('click', async (event) => {
      const userId = event.target.getAttribute('data-id');
      if (!confirm('Are you sure you want to revoke this user?')) return;

      try {
        await revokeAdminUser(userId);
        alert("User revoked successfully");
        renderAdminUsers(); // reload table
      } catch (err) {
        alert("Failed to revoke user");
      }
    });
  });

  document.querySelectorAll('.roleSelector').forEach(selector => {
    selector.addEventListener('change', async (event) => {
      const newRole = event.target.value;
      const userId = event.target.getAttribute('data-id');
      if (!newRole) return;

      if (!confirm(`Are you sure you want to assign role ${newRole}?`)) return;

      try {
        await updateUserRole(userId, newRole);
        alert(`Role updated to ${newRole}`);
        renderAdminUsers();
      } catch (err) {
        alert("Failed to update role");
      }
    });
  });
}
