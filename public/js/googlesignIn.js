// googleSignIn.js (used in browser only)
import { auth } from '../../utils/firebase.js';
import { signInCore } from './signInCore.js';
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";


export const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  return await signInCore(user);
};
