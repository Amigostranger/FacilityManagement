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
    // const status="allowed";
    const which=await check(user.email);
    console.log(which);
    
    if(which==="revoked"){
      alert("Your account has been revoked.");
      return;
    }
    //http://localhost:3000
    //https://sports-management.azurewebsites.net
    const response = await fetch("http://localhost:3000/api/save-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
      body: JSON.stringify({
        email: user.email,
        username: user.displayName || user.email, // Use email as default username
        role:"resident",
        status:"allowed",
      }),
    });
    
    const data = await response.json();
    console.log("Server response:", data);

  } catch (error) {
    console.error("Google sign-in failed:", error);
  }
};
async function check(email) {
  try {
    const response = await fetch(`http://localhost:3000/api/check-users`,{
      method:"POST",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email:email })
    });
    if (!response.ok) {

      if (data.error === "User not available") {
        return "not found";  // or "not_found"
      }
      throw new Error(`Server responded with ${response.status}`);
    }
    const data = await response.json();
    if(data.status=="revoked"){
      console.log("revoked");
      
    }
    console.log(`data.status ${data.status}`);
    
    return data.status;
  } catch (error) {
    console.error(error);
    
  }

}
// Attach event listener for Google Sign-In button
document.getElementById("googleSignInButton").addEventListener("click", googleSignIn);
