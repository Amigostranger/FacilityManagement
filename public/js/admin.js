
// admin.js
const managebtn=document.getElementById('usersBtn');

managebtn.addEventListener('click',async(e)=>{

    e.preventDefault();
    window.location.href="./list_users.html";


});

document.getElementById("reportBtn").addEventListener("click", () => {
    window.location.href = "./staff_admin_issues.html"; 
  });
  document.getElementById("bookingsBtn").addEventListener("click", () => {
    window.location.href = "./staff_admin_booking.html"; 
  });



//---------------------------------------------------------------------------------------------------------------// 



