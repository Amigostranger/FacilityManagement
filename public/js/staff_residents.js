document.addEventListener('DOMContentLoaded', async () => {
    // Back button functionality
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'staff_home.html';
    });

    try {
        // Fetch all users
        const response = await fetch('https://sports-management.azurewebsites.net/api/get-users', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('userToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const allUsers = await response.json();
        
        // Filter for residents only
        const residents = allUsers.filter(user => 
            user.role && user.role.toLowerCase() === 'resident'
        );

        displayResidents(residents);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('residentsTableBody').innerHTML = `
            <tr><td colspan="2">Failed to load residents. Please try again.</td></tr>
        `;
    }
});

function displayResidents(residents) {
    const tbody = document.getElementById('residentsTableBody');
    tbody.innerHTML = '';

    if (residents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2">No residents found</td></tr>';
        return;
    }

    residents.forEach(resident => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${resident.username || 'N/A'}</td>
            <td>${resident.role || 'N/A'}</td>
        `;
        tbody.appendChild(row);
    });
}