
// import fetch from 'node-fetch';  
let totalUsers=0
async function getTotalUsers() {
  try {
    const response = await fetch('https://sports-management.azurewebsites.net/api/get-users')

    if (!response.ok) {

      totalUsers= 0;
    }

    const data = await response.json();
    totalUsers= data.length;
  } catch (error) {
    console.error('Fetch error:', error);
    totalUsers= 0;
  }
}

export {totalUsers,getTotalUsers}
