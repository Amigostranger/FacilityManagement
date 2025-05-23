export async function getUser(id) {
  try {
    const response = await fetch("https://sports-management.azurewebsites.net/api/get-users");
    const data = await response.json();
    const user = data.find(u => u.id === id);
    return user ? user.username : "N/A";
  } catch (err) {
    console.error("Failed to fetch user:", err);
    return "N/A";
  }
}
