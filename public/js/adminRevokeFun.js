// adminRevokeFun.js
const API_BASE = 'https://sports-management.azurewebsites.net';
// const API_BASE='http://localhost:3000'
export async function fetchAdminUsers() {
  try {
    const response = await fetch(`${API_BASE}/api/get-users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const allUsers = await response.json();
    return allUsers.filter(user => user.role?.toLowerCase() !== 'admin');
; // only Staff/Admin
  } catch (err) {
    console.error("Failed to fetch admin users:", err);
    return [];
  }
}

export async function revokeAdminUser(userId) {
  try {
    const response = await fetch(`${API_BASE}/api/user-revoke/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "revoked" })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to revoke");
    return result;
  } catch (err) {
    console.error("Error revoking admin user:", err);
    throw err;
  }
}

export async function updateUserRole(userId, newRole) {
  try {
    const response = await fetch(`${API_BASE}/api/user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed to update role");
    return result;
  } catch (err) {
    console.error("Failed to update user role:", err);
    throw err;
  }
}
