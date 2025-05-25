
//      }

import { fetchUsers } from './revokeFun.js';
import { renderUsers } from './revokeDom.js';
import { auth } from '../../utils/firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {

    window.location.replace("/login_page.html");
  }
});
async function loadAndRenderUsers() {
  const users = await fetchUsers();
  renderUsers(users);
}

window.addEventListener("usersChanged", loadAndRenderUsers);
window.addEventListener("DOMContentLoaded", loadAndRenderUsers);

