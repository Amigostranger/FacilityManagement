// Fetch issues and update table
async function loadIssues() {
    try {
      const res = await fetch("https://sports-facility-management-web-app.azurewebsites.net/api/issues", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      const issues = await res.json();
      tableBody.innerHTML = ""; // Clear existing rows
  
      issues.forEach(issue => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${issue.title}</td>
          <td>${issue.description}</td>
          <td>${issue.status}</td>
        `;
        tableBody.appendChild(row);
      });
    } catch (err) {
      console.error("Error loading issues:", err);
    }
  }
  
  // Load issues on page load
  window.addEventListener("DOMContentLoaded", loadIssues);
