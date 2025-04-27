


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
  const response = await fetch('https://sports-management.azurewebsites.net/api/get-users');
  const data = await response.json();
   usersarr = data; 
    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = ""; 
  
    usersarr.forEach(users => {
      //const data = users.data();
      if(users.role!='admin' && users.role!="Admin"){
              const row = document.createElement("tr");
  
      row.innerHTML = `
        <td>${users.email || "N/A"}</td>
        <td>${users.role || "None"}</td>
        
        <td>
          <select data-id="${users.id}" class="roleSelector">
            <option value="">-- Select --</option>
            <option value="Resident">Resident</option>
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </select>


        </td>
        <td>
          <button class="deleteBtn" data-id="${users.id}">Revoke</button>
        </td>
      `;
      tbody.appendChild(row);
      }

    });
  
    attachListeners();
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
        
        const response=await fetch(`https://sports-management.azurewebsites.net/api/user/${userId}`,{
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