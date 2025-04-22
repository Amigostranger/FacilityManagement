import { auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const tableBody = document.getElementById("tableBody");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is signed in:", user.email);
    await loadIssues(user); // ✅ Pass the user object
  } else {
    console.log("No user signed in");
    alert("You need to be signed in to view issues.");
  }
});

async function loadIssues(user) {
  try {
    const token = await user.getIdToken();

    const res = await fetch("https://sports-facility-management-web-app.azurewebsites.net/api/issues", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    const issues = data.issues;
    //const issues = await res.json();
    tableBody.innerHTML = "";
    console.log(issues);
    issues.forEach(issue => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${issue.title}</td>
        <td>${issue.description}</td>
        <td>${issue.status}</td>`;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.log("Something is wrong");
    console.error("Error loading issues:", err);
  }
}


window.addEventListener("DOMContentLoaded", loadIssues);
