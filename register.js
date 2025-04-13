import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLsT0OJXoEha8ZKGCZaHgyht5eZ21O-mQ",
  authDomain: "sportsmanagement-a0f0b.firebaseapp.com",
  projectId: "sportsmanagement-a0f0b",
  storageBucket: "sportsmanagement-a0f0b.firebasestorage.app",
  messagingSenderId: "674114167483",
  appId: "1:674114167483:web:e8c57868dcf8bccfce3f9e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google Sign-In button handler
const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Google user:", user);

    // Send user data to backend
   
   
    const response = await fetch("https://my-node-backend-a6ccfgdybygadcfc.southafricanorth-01.azurewebsites.net/api/save-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
      body: JSON.stringify({
        email: user.email,
        username: user.displayName || user.email, // Use email as default username
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

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User signed up:", user);

    // Send user data to backend
    const response = await fetch("http://localhost:3000/api/save-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
      body: JSON.stringify({
        email: user.email,
        username: email, // Use email as default username
      }),
    });

    const data = await response.json();
    console.log("Server response:", data);

  } catch (error) {
    console.error("Sign-up failed:", error);
  }
};

// Attach event listener for email sign-up form
document.getElementById("loginForm").addEventListener("submit", emailSignUp);

// Attach event listener for Google Sign-In button
document.getElementById("googleSignInButton").addEventListener("click", googleSignIn);
