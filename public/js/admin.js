


// admin.js


const managebtn=document.getElementById('usersBtn');

managebtn.addEventListener('click',async(e)=>{

    e.preventDefault();


    const sendIt=await fetch("https://sports-facility-management-web-app.azurewebsites.net/api/mana-users",{
        method:"GET",
        headers:{
            "Content-Type":"application/json"
        },
    })
const data=await sendIt.json();

if(sendIt.ok){
    localStorage.setItem('usersData', JSON.stringify(data)); 
    window.location.href="./users.html";
    // const p=document.getElementById("all");
    // p.textContent = JSON.stringify(data, null, 2);
}
});



// async function fetchUsers(){

//     const getIt=await getDocs(collection(db,"users"));
//     getIt.forEach((doc) => {
//         console.log(`${doc.id}=>`,doc.data());
        
//     });
// }
// fetchUsers();