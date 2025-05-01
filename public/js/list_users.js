import { auth } from './firebase.js'; // Same import as login.js

//https://sports-management.azurewebsites.net
const response=await fetch('https://sports-management.azurewebsites.net/api/get-users',{

  method:"GET",
  headers:{
     "Content-Type":"application/json"
  },

})

const data =await response.json();
//const usersstring = localStorage.getItem('usersData');


let usersarr = [];


if(data){
  usersarr = data;
}
  

async function loadUsers() {
  try {
    const token = await getAuthToken();
    if (!token) {
      alert("Please login first");
      window.location.href = "login.html";
      return;
    }

    // Get current user's data first
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("Could not fetch current user data");
    }

    const response = await fetch('https://sports-management.azurewebsites.net/api/get-users', {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Failed to fetch users");
    
    const usersarr = await response.json();
    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = ""; 
  
    usersarr.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.email || "N/A"}</td>
        <td>${user.role || "None"}</td>
        <td>
          <select data-id="${user.id}" class="roleSelector">
            <option value="">-- Select --</option>
            <option value="Resident" ${user.role === 'Resident' ? 'selected' : ''}>Resident</option>
            ${currentUser.role.toLowerCase() === 'admin' ? `
              <option value="Staff" ${user.role === 'Staff' ? 'selected' : ''}>Staff</option>
              <option value="Admin" ${user.role === 'Admin' ? 'selected' : ''}>Admin</option>
            ` : ''}
          </select>
        </td>
        <td>
          <button class="deleteBtn" data-id="${user.id}">Revoke</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  
    attachListeners();
  } catch (error) {
    console.error("Error loading users:", error);
    alert("Failed to load users");
  }
}

// Helper functions you need to implement:
async function getCurrentUser() {
  // Get current user info from your auth system
  // Example:
  const token = await getAuthToken();
  const response = await fetch('/api/get-user', {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return response.ok ? await response.json() : null;
}

async function getAuthToken() {
  // Check if user is logged in
  const user = auth.currentUser;
  if (!user) {
    console.error("No user logged in");
    return null;
  }
  
  // Get fresh ID token
  try {
    return await user.getIdToken(/* forceRefresh */ true); // true ensures fresh token
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}

  
  function attachListeners() {
    document.querySelectorAll('.deleteBtn').forEach(btn=>{
        btn.addEventListener('click',deleteIT);
    })
  


    document.querySelectorAll(".roleSelector").forEach(it=>{

        it.addEventListener('change',talkToit)

    });
  }
  loadUsers();




  async function talkToit(event) {
    
    const selectedvalue=event.target.value;
    const userId = event.target.getAttribute('data-id');
    const newRole = event.target.value;


    if(!newRole){
      return;
    }


    if (!confirm(`Are you sure you want to change role to ${newRole}?`)) {
      console.log("No");
      
      return;
    }
    try {
        const response=await fetch(`https://sports-management.azurewebsites.net/api/user/${userId}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({ role: newRole })
        });


        const result = await response.json();
        if (response.ok) {
          console.log(`Updated role for user ${userId} to ${newRole}`);

          const user=usersarr.find(u=>u.id===userId);
          if(user){
            user.role=newRole;
            // localStorage.setItem("usersData",JSON.stringify(usersarr));
            loadUsers();
          }
        } else {
          console.error(result.error || 'Failed to update');
        }
    } catch (error) {
        console.error(error);
        
    }

  }

 async function deleteIT(event) {
    const userId=event.target.getAttribute('data-id');
    
    if (!confirm('Confirm to revoke access of user?')) {
      console.log("No");
      
      return;
    }
    try {
        
        const response=await fetch(`/api/user/${userId}`,{
            method:"DELETE",
        });
        const result=await response.json();
        if(response.ok){

         // usersarr=usersarr.filter(user=>user.id!==userId);
          // localStorage.setItem('userData',JSON.stringify(usersarr));
            console.log(` User ${userId} deleted successfully`);
            loadUsers();
        }
        else{
            console.error('Failed to delete user:');
        }

    } catch (error) {
        console.error(error);
        
    }
 }
