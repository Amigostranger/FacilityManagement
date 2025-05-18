//https://sports-management.azurewebsites.net
//http://localhost:3000
  
export async function loadUsers() {
  const response = await fetch('https://sports-management.azurewebsites.net/api/get-users');
  const data = await response.json();
  let usersarr = data; 
  const tbody = document.getElementById("userTableBody");
  tbody.innerHTML = ""; 
  usersarr.forEach(users => {
    if(users.role!='admin' && users.role!="Admin" && users.role!='staff' && users.role!='Staff'){
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${users.email || "N/A"}
          </td>
          <td><button class="deleteBtn" data-id="${users.id}">Revoke</button></td>`;
        tbody.appendChild(row);
        }
      });
      attachListeners();
    }

function attachListeners() {
  document.querySelectorAll('.deleteBtn').forEach(btn=>{
    btn.addEventListener('click',deleteIT);
      })
    }
loadUsers();
  
export async function deleteIT(event) {
  const userId=event.target.getAttribute('data-id');
  if (!confirm('Confirm to revoke access of user?')) {
    console.log("No");
    return;
  }
  try {
    const response=await fetch(`https://sports-management.azurewebsites.net/api/user-revoke/${userId}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({ status: "revoked" })
        });
    const result=await response.json();
    if(response.ok){
        console.log(` User ${userId} revoked successfully`);
        loadUsers();
    }
      else{
        console.error('Failed to Revoke user:');
      }
    }catch(error) {
        console.error(error);    
    }
}