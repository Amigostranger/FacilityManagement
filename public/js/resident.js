const reportBtn=document.getElementById('reportBtn');
const notificationBtn = document.getElementById('notificationBtn');
const notificationImg = document.getElementById("notify");
import { googleSignOut } from "./googleSignout.js";
import { loadWeather } from './weather.js';

import { auth } from '../../utils/firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {

    window.location.replace("/login_page.html");
  }
});
reportBtn.addEventListener('click',async(e)=>{
    e.preventDefault();  
    window.location.href = "./resident_report_issue.html";
});


document.getElementById("userImgBtn").addEventListener('click',() => {
    googleSignOut();
    window.location.href = "./login_page.html"; 
  })

notificationBtn.addEventListener('click',async(e)=>{
    e.preventDefault();
    window.location.href="./resident_notifications.html"

});

const bookingsBtn=document.getElementById('bookingsBtn');
bookingsBtn.addEventListener('click',async(e)=>{
    e.preventDefault();
    window.location.href = "./resident_new_booking.html"; 
});

const counter = document.getElementById('counter');

bookingsBtn.addEventListener('click',async(e)=>{
    e.preventDefault();
    window.location.href = "./resident_new_booking.html"; 
});


function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); // toast visible for 3 seconds
}

contactBtn.addEventListener('click', async (e) => {
  showToast("Contact us at: sportfacility3@gmail.com");
});





// Add the 'shake' class to trigger the animation
notificationImg.classList.add("shake");

// Remove the class after animation ends so it can be triggered again later
notificationImg.addEventListener("animationend", () => {
    notificationImg.classList.remove("shake");
  });

window.addEventListener('DOMContentLoaded', loadWeather);

