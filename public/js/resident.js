const reportBtn=document.getElementById('reportBtn');
const notificationBtn = document.getElementById('notificationBtn');
const notificationImg = document.getElementById("notify");
import { loadWeather } from './weather.js';


reportBtn.addEventListener('click',async(e)=>{
    e.preventDefault();  
    window.location.href = "./resident_report_issue.html";
});

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



// Add the 'shake' class to trigger the animation
notificationImg.classList.add("shake");

// Remove the class after animation ends so it can be triggered again later
notificationImg.addEventListener("animationend", () => {
    notificationImg.classList.remove("shake");
  });

window.addEventListener('DOMContentLoaded', loadWeather);

