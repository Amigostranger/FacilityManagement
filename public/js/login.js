// login.js
import { signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from '../../utils/firebase';

//const loginForm = document.getElementById("btnlog");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const message = document.getElementById("message");
const signup=document.getElementById('sign-up');
let hy=null;


//https://sports-management.azurewebsites.net

// Handle Google Sign-In
googleLoginBtn.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();

    //http://localhost:3000/
       const response = await fetch('https://sports-management.azurewebsites.net/api/get-user', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      message.textContent = `Welcome, ${data.username}! Role: ${data.role}`;
      setTimeout(() => {
        const the=data.role.toUpperCase();
        if(the==="RESIDENT"){
          window.location.href = 'resident_home.html';
        }
        else if(the=="STAFF"){
          window.location.href = 'staff_home.html';
        }
        else if(the==="ADMIN"){
          window.location.href = 'admin_home.html'
        }
       
      }, 2000);
    } else {
      message.textContent = `Error: ${data.error}`;
      message.style.color = "red";
      signup.textContent='Sign up';
    }
  } catch (error) {
    message.textContent = "Google login failed: " + error.message;
    message.style.color = "red";
  }
});

signup.addEventListener('click',event=>{
  window.location.href='register.html';
})
