import { revokeUser } from './revokeFun.js';

export function renderUsers(users) {
  const tbody = document.getElementById("userTableBody");
  tbody.innerHTML = "";

  users.forEach(user => {
    const role = user.role?.toLowerCase();
    if (role !== 'admin' && role !== 'staff') {
      const row = document.createElement("tr");
      const status = user.status === "revoked" ? "Unrevoke" : "Revoke";

      row.innerHTML = `
        <td>${user.username || "N/A"}</td>
        <td>${user.role || "N/A"}</td>
        <td><button class="toggleBtn" data-id="${user.id}" data-status="${user.status}">${status}</button></td>
      `;

      tbody.appendChild(row);
    }
  });

  attachToggleListeners();
}


function attachToggleListeners() {
  document.querySelectorAll('.toggleBtn').forEach(btn => {
    btn.addEventListener('click', async (event) => {
      const userId = event.target.getAttribute('data-id');
      const currentStatus = event.target.getAttribute('data-status');
      const newStatus = currentStatus === "revoked" ? "allowed" : "revoked";

      const confirmMsg = currentStatus === "revoked"
        ? "Confirm to un-revoke this resident?"
        : "Confirm to revoke access of this resident?";
      if (!confirm(confirmMsg)) return;
      console.log(`User ID: ${userId}, Current Status: ${currentStatus}, New Status: ${newStatus}`);

      try {
        await revokeUser(userId, newStatus);
        alert(`User ${newStatus === "revoked" ? "revoked" : "unrevoked"} successfully`);
        window.dispatchEvent(new Event("usersChanged")); // will re-render table
      } catch (err) {
        alert("Failed to update user status");
      }
    });
  });
}

