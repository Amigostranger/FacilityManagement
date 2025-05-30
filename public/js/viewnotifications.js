
import { auth } from '../../utils/firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
document.addEventListener("DOMContentLoaded", () => {
const tableBody = document.querySelector("#notificationTable tbody");

//Event details
const viewModal = document.getElementById("viewModal");
const article= document.querySelector("#viewModal article");
const viewDescribe= document.getElementById("describe");
const viewFacility=document.getElementById("facility");
const viewStart=document.getElementById("start");
const viewEnd=document.getElementById("end");


const counter = document.getElementById('counter');

const closeViewBtn = document.getElementById("closeViewBtn");



onAuthStateChanged(auth, async (user) => {
  if (user) {
    if(counter){
      setInterval(() => {
      (async () => {
        await countread(user);
      })();
    }, 5000);
    }
  else{
    await loadnotifications(user);      
    }
    
   } 
  else {
    window.location.replace("/login_page.html");
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
    //http://localhost:3000
    const res = await fetch("https://sports-management.azurewebsites.net/api/notifications", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    const events = data.events;
    events.sort((a, b) => {
      const dateA = a.start?._seconds || 0;
      const dateB = b.start?._seconds || 0;
      return dateB - dateA; // for latest to earliest
    });
    events.forEach(async (event) => {
      const row = document.createElement("tr");
      
      const from =event.submittedByInfo.username;
      let recDate = "5/17/2025, 10:58:02 PM";
      if (event.createdAt && typeof event.createdAt._seconds === "number") {
        
        recDate = new Date(event.createdAt._seconds * 1000).toLocaleString();
      } else {
        console.log("createdAt is missing for event:", event.id);
      }
      
      const eventCell = document.createElement('td');
      const fromCell = document.createElement('td');
      const receiveDate=document.createElement('td');

      row.addEventListener("click",()=>{readMore(event,row)});

      updateFromcell(fromCell,from)
      eventCell.textContent = event.title;
      receiveDate.textContent=recDate;
      
      row.appendChild(fromCell);
      row.appendChild(eventCell);
      row.appendChild(receiveDate);
  
      tableBody.appendChild(row); 
      if(event.read=="true"){
        row.classList.add("clicked-row");
        row.querySelectorAll("td").forEach(cell => {cell.style.color = "white";} );
      }else{
         row.classList.add("unclicked-row");
         row.querySelectorAll("td").forEach(cell => {
          cell.style.color = " rgba(27, 24, 24, 0.9)";
        });
      }
     
    });
  } catch (err) {
    console.log("Something is wrong");
    console.error("Error loading issues:", err);
  }
}

function updateVisibility(countRead) {
    counter.style.visibility = countRead === 0 ? "hidden" : "visible";
}
function updateFromcell(fromCell,from){
  const textNode = document.createTextNode(from);
  fromCell.appendChild(textNode);
}
async function readMore(event,row){
  const token = await auth.currentUser.getIdToken();
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
        console.log("Server response : ",msg.message);
        
        document.querySelectorAll("#notificationTable tr").forEach(r => r.classList.remove("clicked-row"));
        row.classList.add("clicked-row");
        row.querySelectorAll("td").forEach(cell => {
          cell.style.color = "white";
        });
        
      // console.log(event);
      viewFacility.textContent = event.facility || "No Facility";
      viewStart.textContent = event.start || "No start time";
      viewEnd.textContent = event.end || "No end time";
      viewDescribe.textContent = event.description || "No description.";
      //viewModal.hidden = false;
      viewModal.hidden = false;
      
      article.classList.remove('bounce-in'); // reset
      void article.offsetWidth;              // trigger reflow
      article.classList.add('bounce-in');
}


async function countread(user){
    const token = await user.getIdToken();
    const res = await fetch("https://sports-management.azurewebsites.net/api/count-read", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      let countRead = data.countRead;
     
      counter.innerText = countRead;
      
      updateVisibility(countRead);
      
}


if(viewModal){
    viewModal.addEventListener("click", (e) => {
    if (e.target === viewModal) {
      viewModal.hidden = true;
    }
  });

closeViewBtn.addEventListener("click", () => {
    viewModal.hidden = true;
  });
  
 document.getElementById("homeBtn").addEventListener("click", () => {
    window.location.href = "./resident_home.html"; 
  });
  document.getElementById("bookBtn").addEventListener("click", () => {
    window.location.href = "./resident_new_booking.html"; 
  });
  document.getElementById("issuesBtn").addEventListener("click", () => {
    window.location.href = "./resident_report_issue.html"; 
  });
}
})

