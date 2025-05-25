import { googleSignIn } from './googlesignIn.js';


document.getElementById("googleSignInButton").addEventListener("click", googleSignIn);
btnGoLog
document.getElementById("btnGoLog").addEventListener("click",async(e)=>{
    e.preventDefault();
    window.location.href = "./login_page.html"; 
});


