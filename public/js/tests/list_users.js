async function loadUsers() {
    try {
      const response = await fetch('/api/users');
      const users = await response.json();
  
      const usersTable = document.getElementById('usersTable');
      usersTable.innerHTML = '';
  
      users.forEach(user => {
        const row = usersTable.insertRow();
        row.innerHTML = `
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>
            <button onclick="changeRole('${user.id}')">Change Role</button>
            <button onclick="revokeUser('${user.id}')">Revoke</button>
          </td>
        `;
      });
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }
  
  async function talkToit(event) {
    const selectedvalue = event.target.value;
    const userId = event.target.getAttribute('data-id');
    const newRole = selectedvalue;
  
    if (!newRole) return;
  
    if (!confirm(`Are you sure you want to change role to ${newRole}?`)) {
      console.log("No");
      return;
    }
  
    try {
      const response = await fetch(`https://sports-management.azurewebsites.net/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ role: newRole })
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log(`Updated role for user ${userId} to ${newRole}`);
  
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
  
  module.exports = { loadUsers, talkToit };
  