const p=document.getElementById("all")



const users = localStorage.getItem('usersData');
//p.textContent=users


let usersarr = [];

  usersarr = JSON.parse(users);


function userTable(data){

    const table=document.createElement('table')

    const thead=document.createElement('thead');
    const headrow=document.createElement('tr');
    ['id', 'email', 'username','role','edit'].forEach(key => {
        const th = document.createElement('th');
        if (key === 'edit') {
            th.textContent = 'Action';
          } else {
            th.textContent = key;
          }
        headrow.appendChild(th);
      });
      thead.appendChild(headrow);
      table.appendChild(thead);



      const tbody = document.createElement('tbody');
      data.forEach(user => {
    const row = document.createElement('tr');
    Object.values(user).forEach(val => {
      const td = document.createElement('td');
      td.textContent = val;
      row.appendChild(td);
    });

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    const actionTd = document.createElement('td');
    actionTd.appendChild(editBtn);
    row.appendChild(actionTd);
    tbody.appendChild(row);
  });

  table.appendChild(tbody);



document.getElementById('tafula').appendChild(table);
}


userTable(usersarr);

