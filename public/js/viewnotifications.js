
import { auth } from '../../utils/firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
//import { onAuthStateChanged } from 'firebase/auth';


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
    //http://localhost:3000
    const res = await fetch("https://sports-management.azurewebsites.net/api/notifications", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    const events = data.events;
    console.log(events)
    // Sort events by date (latest first, or reverse `<` to `>` for earliest first)
    events.sort((a, b) => {
      const dateA = a.start?._seconds || 0;
      const dateB = b.start?._seconds || 0;
      return dateB - dateA; // for latest to earliest
    });
    events.forEach(async (event) => {
      const row = document.createElement("tr");
      // const resAdmin= await fetch(`http://localhost:3000/api/adminInfo/${event.id}`)
      // const adminInfo=await resAdmin.json();

      // console.log(adminInfo);
      const from = "Kathaza";
      const recDate="2025/02/01"
      const eventCell = document.createElement('td');
      const fromCell = document.createElement('td');
      const receiveDate=document.createElement('td');

      row.addEventListener("click",()=>{readMore(event,row)});

      updateFromcell(fromCell,from)
      eventCell.textContent = event.title;
      receiveDate.textContent=recDate;
      // Append cells to the row
       //row.classList.add("unclicked-row");
      row.appendChild(fromCell);
      row.appendChild(eventCell);
      row.appendChild(receiveDate);
      //row.innerHTML =`<td style="color: ${event.title ? 'blue' : 'gray'};">${event.title || "No Title"}</td>`;
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
    // Create the image element
  const img = document.createElement('img');
  img.src = 'img/randompic.jpg'; // Set image source
  img.alt = 'Avatar';            // Optional alt text
  img.style.width = '24px';      // Optional: adjust size
  img.style.height = '24px';
  img.style.marginRight = '8px'; // Space between image and text
  img.style.verticalAlign = 'middle'; // Align with text
  // Create the text node
  const textNode = document.createTextNode(from);
  // Append both image and text
  fromCell.appendChild(img);
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
        
      console.log(event)
      viewFacility.textContent = event.facility || "No Facility";
      viewStart.textContent = event.start && event.start._seconds? new Date(event.start._seconds * 1000).toLocaleString(): "No start time";
      viewEnd.textContent = event.end && event.end._seconds? new Date(event.end._seconds * 1000).toLocaleString(): "No end time";
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
const modal = document.getElementById('viewModal');
const article = modal.querySelector('article');

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

article.addEventListener('mousedown', (e) => {
  isDragging = true;
  const rect = article.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
  article.style.position = 'absolute';
  article.style.zIndex = '1000';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  article.style.left = (e.clientX - offsetX) + 'px';
  article.style.top = (e.clientY - offsetY) + 'px';
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});
  closeViewBtn.addEventListener("click", () => {
    viewModal.hidden = true;
  });
}






})
