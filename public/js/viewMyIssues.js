// import { auth } from './firebase.js';
// import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// function loadIssues(user) {




//   user.getIdToken().then(async (token) => {
//     const response = await fetch("http://localhost:3000/api/issues", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });




//     if (!response.ok) {
//       const error = await response.json();
//       console.error("Error fetching issues:", error);
//       alert(error.error || "Failed to load issues");
//       return;
//     }

//     const { issues } = await response.json();
//     const tbody = document.getElementById("userTableBody");
//     tbody.innerHTML = "";

//     issues.forEach(issue => {
//       const row = document.createElement("tr");
//       row.innerHTML = `
//         <td>${issue.title || "N/A"}</td>
//         <td>${issue.description || "None"}</td>
//         <td>${issue.status || "None"}</td>
//       `;
//       tbody.appendChild(row);
//     });
//   });
// }

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     loadIssues(user); 
//   } else {
//     alert("You must be logged in to view issues.");
//     window.location.href = "/login.html"; 
//   }
// });




import { auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const tableBody = document.querySelector("#issuesTable tbody");
const viewModal = document.getElementById("viewModal");
const viewDescription = document.getElementById("issueDescription");
const viewFeedback = document.getElementById("feedback");
const closeViewBtn = document.getElementById("closeViewBtn");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is signed in:", user.email);
    await loadIssues(user);
  } else {
    console.log("No user signed in");
    alert("You need to be signed in to view issues.");
  }
});

async function loadIssues(user) {
  try {
    const token = await user.getIdToken();

    const res = await fetch("http://localhost:3000/api/issues", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const issues = await res.json();

    let arrayy=[];
    tableBody.innerHTML = "";
    arrayy=issues;
    arrayy.forEach(issue => {
      const row = document.createElement("tr");

      const viewBtn = document.createElement("button");
      viewBtn.textContent = "View";
      viewBtn.type = "button";
      viewBtn.addEventListener("click", () => {
        viewDescription.textContent = issue.description || "No description.";
        viewFeedback.textContent = issue.feedback || "No feedback yet.";
        viewModal.hidden = false;
      });

      row.innerHTML = `
        <td>${issue.title}</td>
        <td></td>
        <td>${issue.status}</td>
      `;
      row.children[1].appendChild(viewBtn);

      tableBody.appendChild(row);
    });

  } catch (err) {
    console.error("Error loading issues:", err);
  }
}

viewModal.addEventListener("click", (e) => {
  if (e.target === viewModal) {
    viewModal.hidden = true;
  }
});

closeViewBtn.addEventListener("click", () => {
  viewModal.hidden = true;
});