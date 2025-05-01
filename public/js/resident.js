

const reportBtn=document.getElementById('reportBtn');
const notificationBtn = document.getElementById('notificationBtn');

reportBtn.addEventListener('click',async(e)=>{
    e.preventDefault();
  
    window.location.href = "./resident_report_issue.html";
});

notificationBtn.addEventListener('click',async(e)=>{
    e.preventDefault();
    window.location.href="./resident_notifications.html"
<<<<<<< Updated upstream
})

=======
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
>>>>>>> Stashed changes
