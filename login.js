// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBLsT0OJXoEha8ZKGCZaHgyht5eZ21O-mQ",
  authDomain: "sportsmanagement-a0f0b.firebaseapp.com",
  projectId: "sportsmanagement-a0f0b",
  storageBucket: "sportsmanagement-a0f0b.firebasestorage.app",
  messagingSenderId: "674114167483",
  appId: "1:674114167483:web:e8c57868dcf8bccfce3f9e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById("loginForm");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const message = document.getElementById("message");
const signup=document.getElementById('sign-up');

// Handle Email/Password login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();

    const response = await fetch("/api/get-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // const data = await response.json();
    const responseText = await response.text();
    console.log("Raw response:", responseText);

    // Try to parse JSON only if the response is not empty
    let data;
    if (responseText.trim() !== '') {
      data = JSON.parse(responseText);
    } else {
      throw new Error("Empty response body");
    }
    if (response.ok) {
      message.textContent = `Welcome, ${data.username}! Role: ${data.role}`;
      setTimeout(() => {
        window.location.href = 'admin_home.html';
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

    const response = await fetch('/api/get-user', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    //const data = await response.json();
    const responseText = await response.text();
    console.log("Raw response:", responseText);
      // Try to parse JSON only if the response is not empty
      let data;
      if (responseText.trim() !== '') {
        data = JSON.parse(responseText);
      } else {
        throw new Error("Empty response body");
      }

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
