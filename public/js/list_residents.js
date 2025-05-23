
//      }

import { fetchUsers } from './revokeFun.js';
import { renderUsers } from './revokeDom.js';

async function loadAndRenderUsers() {
  const users = await fetchUsers();
  renderUsers(users);
}

window.addEventListener("usersChanged", loadAndRenderUsers);
window.addEventListener("DOMContentLoaded", loadAndRenderUsers);

