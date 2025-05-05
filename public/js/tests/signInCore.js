// signInCore.js

import { check } from './check.js'; // Adjust path based on your file structure

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
