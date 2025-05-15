
// import fetch from 'node-fetch';  

export async function getTotalUsers() {
  try {
    const response = await fetch('http://localhost:3000/api/get-users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      console.error('Failed to fetch users:', response.status);
      return 0;
    }

    const data = await response.json();
    return data.length;
  } catch (error) {
    console.error('Fetch error:', error);
    return 0;
  }
}

//export { totUsers };