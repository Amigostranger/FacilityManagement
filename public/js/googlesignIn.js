// googleSignIn.js (used in browser only)
import { auth } from '../../utils/firebase.js';
import { signInCore } from './signInCore.js';
import { GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

export const googleSignIn = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const additionalInfo = getAdditionalUserInfo(result);
    if (additionalInfo.isNewUser) {
      alert("Account created. Please log in.");
    }

    return await signInCore(user);
  } catch (error) {
    console.error("Google sign-in failed:", error);
    alert("Something went wrong during sign-in. Please try again.");
  }
};
