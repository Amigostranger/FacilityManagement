import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from './firebase.js';

const googleLoginBtn = document.getElementById("googleLoginBtn");
const message = document.getElementById("message");
const signup = document.getElementById('sign-up');

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
      
      // Store user data in localStorage for role-based access control
      localStorage.setItem('userToken', token);
      localStorage.setItem('userRole', data.role.toUpperCase());
      localStorage.setItem('userId', data.userId || result.user.uid);
      localStorage.setItem('userEmail', result.user.email);
      
      setTimeout(() => {
        const role = data.role.toUpperCase();
        redirectBasedOnRole(role);
      }, 2000);
    } else {
      showError(`Error: ${data.error}`);
    }
  } catch (error) {
    showError("Google login failed: " + error.message);
  }
});

// Helper function for role-based redirection
function redirectBasedOnRole(role) {
  switch(role) {
    case "RESIDENT":
      window.location.href = 'resident_home.html';
      break;
    case "STAFF":
      window.location.href = 'staff_home.html';
      break;
    case "ADMIN":
      window.location.href = 'admin_home.html';
      break;
    default:
      showError("Unknown user role");
      break;
  }
}

// Helper function to display errors
function showError(errorMessage) {
  message.textContent = errorMessage;
  message.style.color = "red";
  signup.textContent = 'Sign up';
}

// Handle signup click
signup.addEventListener('click', event => {
  window.location.href = 'register.html';
});