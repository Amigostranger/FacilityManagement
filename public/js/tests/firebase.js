// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; // Same version as firebase-auth


import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


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
const db=getFirestore(app);
export {db,auth };