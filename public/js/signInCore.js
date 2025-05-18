// signInCore.js
export async function signInCore(user) {
    const email = user.email;
    const username = user.displayName || email;
    const role = "Resident";
  
    const status = await check(email);
    if (status === "revoked") {
      alert("Your account has been revoked.");
      return {};
    }
  
    const token = await user.getIdToken();
  
    const response = await fetch("https://sports-management.azurewebsites.net/api/save-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, username, role: "resident", status: "allowed" }),
    });
  
    const data = await response.json();
    return { success: true, serverData: data };
  }
  
export  async function check(email) {
    try {
      const response = await fetch("https://sports-management.azurewebsites.net/api/check-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        if (data.error === "User not available") return "not found";
        throw new Error(`Server responded with ${response.status}`);
      }
  
      if (data.status === "revoked") return "revoked";
      if (data.error === "User not available") return "not found";
  
      return data.status;
    } catch (error) {
      console.error("Error in check:", error);
      return "error";
    }
  }
  