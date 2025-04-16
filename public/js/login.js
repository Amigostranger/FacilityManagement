
import {  signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from './firebase.js';;



const loginForm = document.getElementById("btnlog");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const message = document.getElementById("message");
const signup=document.getElementById('sign-up');

// Handle Email/Password login
loginForm.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();

    const response = await fetch("https://sports-facility-management-web-app.azurewebsites.net/api/get-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      message.textContent = `Welcome, ${data.username}! Role: ${data.role}`;
      setTimeout(() => {
        if(data.role=="resident"){
          window.location.href = 'resident_home.html';
        }
        else if(data.role=="facility staff"){
          window.location.href = 'staff_home.html';
        }
        else{
          window.location.href = 'admin_home.html'
        }
      }, 2000);
    } else {
      message.textContent = `Error: ${data.error}`;
      signup.textContent='Sign up';
    }
  } catch (error) {
    message.textContent = "Login failed: " + error.message;
  }
});

// Handle Google Sign-In
googleLoginBtn.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();

    // const response = await fetch('https://my-node-backend-a6ccfgdybygadcfc.southafricanorth-01.azurewebsites.net/api/get-user', {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    // });


       const response = await fetch('https://sports-facility-management-web-app.azurewebsites.net/api/get-user', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      message.textContent = `Welcome, ${data.username}! Role: ${data.role}`;
      setTimeout(() => {
        if(data.role=="resident"){
          window.location.href = 'resident_home.html';
        }
        else if(data.role=="facility staff"){
          window.location.href = 'staff_home.html';
        }
        else{
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
