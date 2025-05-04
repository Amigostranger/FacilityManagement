
import { auth } from './firebase.js';
//import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { onAuthStateChanged } from 'firebase/auth';


document.addEventListener("DOMContentLoaded", () => {
  // All your code here, or at least the part accessing `counter`


//const tableBody = document.getElementById("notificationTable");
const tableBody = document.querySelector("#notificationTable tbody");
if (!tableBody) {
  console.error("Table body with ID 'notificationTable' not found in the DOM.");
  return; // Stop further execution to prevent errors
}
//Event details
const viewDescribe= document.getElementById("describe");
const viewDate=document.getElementById("date");
const viewModal = document.getElementById("viewModal");
const viewFacility=document.getElementById("facility");
const viewStart=document.getElementById("start");
const viewEnd=document.getElementById("end");

let countRead=0;
const counter = document.getElementById('counter');

const closeViewBtn = document.getElementById("closeViewBtn");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    
    await loadnotifications(user);
    await countread(user);
  } else {
    console.log("No user signed in");
    alert("You need to be signed in to view issues.");
  }
});

async function loadnotifications(user) {
  try {
    const token = await user.getIdToken();
    if (!token) {
      alert("Authentication failed. Please sign in again.");
      return;
    }
    //https://sports-management.azurewebsites.net
    const res = await fetch("https://sports-management.azurewebsites.net/api/notifications", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    const events = data.events;
    
    //console.log("EVENTS",events);

    events.forEach(async (event) => {
      const row = document.createElement("tr");
   
      row.addEventListener("click",async () => {
        const resRead = await fetch("https://sports-management.azurewebsites.net/api/read", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({
            notification: event.id
          })
        });
        const msg= await resRead.json();
        console.log(msg.message);
        
        document.querySelectorAll("#notificationTable tr").forEach(r => r.classList.remove("clicked-row"));
        row.classList.add("clicked-row");
        row.querySelectorAll("td").forEach(cell => {
          cell.style.color = "white";
        });
        
        viewDate.textContent = event.date || "No Date";
        viewFacility.textContent = event.facility || "No Facility";
        viewStart.textContent = event.start || "No start time";
        viewEnd.textContent = event.end || "No End time";
        viewDescribe.textContent = event.description || "No description.";
        viewModal.hidden = false;
      });

      row.innerHTML =`<td style="color: ${event.title ? 'blue' : 'gray'};">${event.title || "No Title"}</td>`;
      if (tableBody) {
        tableBody.appendChild(row); // or whatever logic you have
      }

      if(event.read=="true"){
        
        row.classList.add("clicked-row");
        row.querySelectorAll("td").forEach(cell => {cell.style.color = "white";} );
      }
     
    });
  } catch (err) {
    console.log("Something is wrong");
    console.error("Error loading issues:", err);
  }
}



async function countread(user){
    const token = await user.getIdToken();
    const res = await fetch("https://sports-management.azurewebsites.net/api/count-read", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      countRead = data.countRead;
      console.log(counter);
      if (counter) {
        counter.innerText = countRead;
        counter.style.visibility = countRead === 0 ? "hidden" : "visible";
      } else {
        console.warn("Counter element not found in the DOM.");
      }
     
      console.log("Number of unread notification : ",countRead)

}

viewModal.addEventListener("click", (e) => {
  if (e.target === viewModal) {
    viewModal.hidden = true;
  }
});

closeViewBtn.addEventListener("click", () => {
  viewModal.hidden = true;
});


})
