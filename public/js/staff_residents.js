document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verify staff role
    if (localStorage.getItem('userRole') !== 'STAFF') {
        alert('Only staff can access this page');
        window.location.href = 'staff_home.html';
        return;
    }

    // 2. Set up back button
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'staff_home.html';
    });

    // 3. Load resident data
    loadResidents();
});

async function loadResidents() {
    try {
        const response = await fetch('https://sports-management.azurewebsites.net/api/residents', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch');
        
        const residents = await response.json();
        renderResidents(residents);
        setupSearch();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('residentsTableBody').innerHTML = `
            <tr><td colspan="4" class="error">Failed to load residents. Please try again.</td></tr>
        `;
    }
}

function renderResidents(residents) {
    const tbody = document.getElementById('residentsTableBody');
    tbody.innerHTML = '';

    residents.forEach(resident => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${resident.email}</td>
            <td><span class="status-badge ${resident.active ? 'active' : 'inactive'}">
                ${resident.active ? 'Active' : 'Inactive'}
            </span></td>
            <td>${formatDate(resident.lastActive)}</td>
            <td>
                <button class="view-btn" data-id="${resident.id}">
                    View Details
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Add click handlers to all view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const residentId = e.target.getAttribute('data-id');
            window.location.href = `resident_details.html?id=${residentId}`;
        });
    });
}

// Helper functions
function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString();
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('#residentsTableBody tr').forEach(row => {
            const email = row.cells[0].textContent.toLowerCase();
            row.style.display = email.includes(term) ? '' : 'none';
        });
    });
}