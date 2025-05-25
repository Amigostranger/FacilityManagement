import { auth } from '../../utils/firebase.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

export const googleSignOut = async () => {
  try {
    await signOut(auth);
    sessionStorage.clear(); // Optional: clear app session
    console.log("User signed out successfully");
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false, error };
  }
};

