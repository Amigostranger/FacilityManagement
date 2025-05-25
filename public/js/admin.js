import { auth } from '../../utils/firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { googleSignOut } from "./googleSignout.js";

onAuthStateChanged(auth, (user) => {
  const app = document.getElementById("app");
  const loadingText = document.getElementById("loadingText");

  if (!user) {
  
    window.location.replace("/login_page.html");
  } else {
   
    loadingText.style.display = "none";
    app.style.display = "block";

  
    document.getElementById("usersBtn").addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = "./list_users.html";
    });

    document.getElementById("reportBtn").addEventListener("click", () => {
      window.location.href = "./staff_admin_issues.html";
    });

    document.getElementById("bookingsBtn").addEventListener("click", () => {
      window.location.href = "./staff_admin_booking.html";
    });

    document.getElementById("dashboardBtn").addEventListener("click", () => {
      window.location.href = "./reports_dashboard.html";
    });

    document.getElementById("userImgBtn").addEventListener('click', async () => {
      await googleSignOut();
      window.location.replace("./login_page.html");
    });
  }
});
