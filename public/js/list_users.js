

import { renderAdminUsers } from './adminRevokeDom.js';
import { auth } from '../../utils/firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {

    window.location.replace("/login_page.html");
  }
})
document.addEventListener('DOMContentLoaded', renderAdminUsers);
