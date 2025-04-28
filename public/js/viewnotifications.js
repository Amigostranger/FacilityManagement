import { auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const tableBody = document.getElementById("notificationTable");


//Event details
const viewDescribe= document.getElementById("describe");
const viewDate=document.getElementById("date");

const viewFacility=document.getElementById("facility");
const viewStart=document.getElementById("start");
const viewEnd=document.getElementById("end");

const closeViewBtn = document.getElementById("closeViewBtn");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is signed in:", user.email);
    await loadnotifications(user);
  } else {
    console.log("No user signed in");
    alert("You need to be signed in to view issues.");
  }
});

async function loadnotifications(user) {
  try {
    const token = await user.getIdToken();

    const res = await fetch("https://sports-management.azurewebsites.net/api/notifications", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    const events = data.events;
    
    console.log(events);

  
    events.forEach(event => {

      const row = document.createElement("tr");
  
      

      row.addEventListener("click", () => {
      row.style.backgroundColor = "rgba(143, 138, 132, 0.9)";
      viewDate.textContent =event.date||"No Date";
      viewFacility.textContent =event.facility||"No Facility";
      viewStart.textContent =event.start||"No start time";
      viewEnd.textContent =event.end||"No End time";
      
      viewDescribe.textContent = event.description || "No description.";
      viewModal.hidden = false;
      });

      row.innerHTML =`<td style="color: ${event.title ? 'white' : 'gray'};">${event.title || "No Title"}</td>`;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.log("Something is wrong");
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






