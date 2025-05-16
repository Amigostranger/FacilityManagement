import { auth } from '../../utils/firebase.js';

export async function getPieChartData() {
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in first.");
        return { series: [], labels: [] };
    }
    try {
        const idToken = await user.getIdToken();
        const response = await fetch('https://sports-management.azurewebsites.net/api/status-counts', {
            headers: {
                "Authorization": `Bearer ${idToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Handle both possible response structures
        return {
            series: result.data?.series || result.series || [],
            labels: result.data?.labels || result.labels || []
        };
    } catch (error) {
        console.error("Error fetching pie chart data:", error);
        return { series: [], labels: [] };
    }
}