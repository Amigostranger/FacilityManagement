const users = localStorage.getItem('usersData');
const para=document.createElement('p');
para.textContent=users;

document.body.appendChild(para);
