//import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
//import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import{auth} from './firebase.js'

const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Google user:", user);

    // Send user data to backend
   
   
    const response = await fetch("https://sports-facility-management-web-app.azurewebsites.net/api/save-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
      body: JSON.stringify({
        email: user.email,
        username: user.displayName || user.email, // Use email as default username
        role:"resident",
      }),
    });

    const data = await response.json();
    console.log("Server response:", data);

  } catch (error) {
    console.error("Google sign-in failed:", error);
  }
};

// Email and Password Sign-Up handler
const emailSignUp = async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role="resident";
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User signed up:", user);

    // Send user data to backend
    const response = await fetch("https://sports-facility-management-web-app.azurewebsites.net/api/save-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
      body: JSON.stringify({
        email: user.email,
        username: email, // Use email as default username
        role:"resident",
      }),
    });

    const data = await response.json();
    console.log("Server response:", data);

  } catch (error) {
    console.error("Sign-up failed:", error);
  }
};

// Attach event listener for email sign-up form
document.getElementById("loginForm").addEventListener("click", emailSignUp);

// Attach event listener for Google Sign-In button
document.getElementById("googleSignInButton").addEventListener("click", googleSignIn);
