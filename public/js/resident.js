const reportBtn=document.getElementById('reportBtn');
const notificationBtn = document.getElementById('notificationBtn');

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


const notificationimg=document.getElementById("notify");
const notificationImg = document.getElementById("notify");

// Add the 'shake' class to trigger the animation
notificationImg.classList.add("shake");

// Remove the class after animation ends so it can be triggered again later
notificationImg.addEventListener("animationend", () => {
    notificationImg.classList.remove("shake");
  });

  const counter = document.getElementById('counter');

// Increase counter by 1
function increaseCounter() {
    counter.innerText = parseInt(counter.innerText) + 1;
}

// Decrease counter by 1 (but don't go below 0)
function decreaseCounter() {
    let value = parseInt(counter.innerText);
    if (value > 0) {
        counter.innerText = value - 1;
    }
}

