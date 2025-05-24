import { auth } from '../../utils/firebase.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

export const googleSignOut = async () => {
  try {
    await signOut(auth);
    // Optionally, clear any app state or redirect to login page
    console.log("User signed out successfully");
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false, error };
  }
};
