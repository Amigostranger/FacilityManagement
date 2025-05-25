const API_BASE = 'https://sports-management.azurewebsites.net';
// const API_BASE='http://localhost:3000'
export async function fetchUsers() {
  try {
    const response = await fetch(`${API_BASE}/api/get-users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return await response.json();
  } catch (err) {
    console.error("Failed to fetch users:", err);
    return [];
  }
}

export async function revokeUser(userId, status = "revoked") {
  try {
    const response = await fetch(`${API_BASE}/api/user-revoke/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to update status");
    return result;
  } catch (err) {
    console.error("Error updating user status:", err);
    throw err;
  }
}

