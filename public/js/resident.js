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
