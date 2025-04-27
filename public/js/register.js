//import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
//import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import{auth} from './firebase.js'

// Google Sign-In button handler
const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // console.log("Google user:", user);

    // Send user data to backend
    const email=user.email;
    const username=user.displayName || user.email;
    const role="Resident";
    // console.log("Sending:", { email, username, role });

    const response = await fetch("https://sports-management.azurewebsites.net/api/save-user", {
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


// Attach event listener for Google Sign-In button
document.getElementById("googleSignInButton").addEventListener("click", googleSignIn);
