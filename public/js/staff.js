
import { googleSignOut } from "./googleSignout.js";

import { auth } from '../../utils/firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {

    window.location.replace("/login_page.html");
  }
});
document.getElementById("reportBtn").addEventListener("click", () => {
    window.location.href = "./staff_admin_issues.html";
  });
  document.getElementById("userImgBtn").addEventListener('click',() => {
      googleSignOut();
      window.location.href = "./login_page.html"; 
    })
  document.getElementById("bookingsBtn").addEventListener("click", () => {
    window.location.href = "./staff_admin_booking.html"; 
  });

  document.getElementById("usersbtn").addEventListener("click", () => {
   
  window.location.href="./list_residents.html";
  });

  document.getElementById("dashboardBtn").addEventListener("click", () => {
    window.location.href = "./reports_dashboard.html"; 
  });
 