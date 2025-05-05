// check.js
export async function check(email) {
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
  