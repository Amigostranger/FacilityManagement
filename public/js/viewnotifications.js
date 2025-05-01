import { auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const tableBody = document.getElementById("notificationTable");


//Event details
const viewDescribe= document.getElementById("describe");
const viewDate=document.getElementById("date");
const viewModal = document.getElementById("viewModal");
const viewFacility=document.getElementById("facility");
const viewStart=document.getElementById("start");
const viewEnd=document.getElementById("end");

const closeViewBtn = document.getElementById("closeViewBtn");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is signed in:", user.email);
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
    //https://sports-management.azurewebsites.net
    const res = await fetch("https://sports-management.azurewebsites.net/api/notifications", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    const events = data.events;
    
    console.log(events);

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
        console.log(event.read);
        row.classList.add("clicked-row");
        row.querySelectorAll("td").forEach(cell => {cell.style.color = "white";} );
      }
      else{
        console.log(event.read);
      }
    });
  } catch (err) {
    console.log("Something is wrong");
    console.error("Error loading issues:", err);
  }
}

let countRead=0;
const counter = document.getElementById('counter');

async function countread(user){
    const token = await user.getIdToken();
    const res = await fetch("https://sports-management.azurewebsites.net/api/count-read", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      countRead = data.countRead;
      counter.innerText=countRead;
      if(countRead==0){
        counter.style.visibility = "hidden";
      }
      else{
        counter.style.visibility="visible"
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






