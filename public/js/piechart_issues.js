import { db } from '../../utils/firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

export async function getPieChartData() {
    try {
        const issuesCollection = collection(db, "Issues");
        const querySnapshot = await getDocs(issuesCollection);
        
        let solvedCount = 0;
        let unsolvedCount = 0;

        querySnapshot.forEach(doc => {
            const data = doc.data();
            if (data.status) {
                
                if (data.status.toLowerCase() === "solved") {
                    solvedCount++;
                } else {
                    unsolvedCount++;
                }
            }
        });

        return {
            series: [solvedCount, unsolvedCount],
            labels: ["Solved", "Unsolved"]
        };
    } catch (error) {
        console.error("Error fetching pie chart data:", error);
        throw error;
    }
}