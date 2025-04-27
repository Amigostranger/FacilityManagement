const reportBtn=document.getElementById('reportBtn');

reportBtn.addEventListener('click',async(e)=>{

    e.preventDefault();

    window.location.href = "./resident_report_issue.html"; 


});

const bookingsBtn=document.getElementById('bookingsBtn');

bookingsBtn.addEventListener('click',async(e)=>{

    e.preventDefault();

    window.location.href = "./resident_new_booking.html"; 


});