


// admin.js


const managebtn=document.getElementById('usersBtn');

managebtn.addEventListener('click',async(e)=>{

    e.preventDefault();


//     const sendIt=await fetch("http://localhost:3000/api/get-users",{
//         method:"GET",
//         headers:{
//             "Content-Type":"application/json"
//         },
//     })
// const data=await sendIt.json();

// if(sendIt.ok){
    // localStorage.setItem('usersData', JSON.stringify(data)); 
    window.location.href="./list_users.html";


});

